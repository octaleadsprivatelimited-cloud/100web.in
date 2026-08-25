#!/usr/bin/env bash
set -Eeuo pipefail

umask 027

archive_path="${1:?Usage: deploy-production.sh <archive> <commit-sha>}"
commit_sha="${2:?Usage: deploy-production.sh <archive> <commit-sha>}"

if [[ ! "${commit_sha}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "The release identifier must be a full Git commit SHA." >&2
  exit 1
fi

if [[ ! -f "${archive_path}" ]]; then
  echo "Deployment archive not found: ${archive_path}" >&2
  exit 1
fi

deploy_user="$(id -un)"
deploy_home="$(getent passwd "${deploy_user}" | cut -d: -f6)"

if [[ -z "${deploy_home}" || "${deploy_home}" != /home/* ]]; then
  echo "Refusing to deploy outside a standard /home user directory." >&2
  exit 1
fi

app_root="${deploy_home}/apps/100web"
releases_dir="${app_root}/releases"
shared_dir="${app_root}/shared"
logs_dir="${app_root}/logs"
current_link="${app_root}/current"
legacy_dir="${deploy_home}/100web.in"
release_name="${commit_sha}-$(date -u +%Y%m%d%H%M%S)-$$"
release_dir="${releases_dir}/${release_name}"
staging_dir=""
preflight_pid=""
preflight_log="${logs_dir}/preflight-${commit_sha}.log"

case "${app_root}" in
  /home/*/apps/100web) ;;
  *)
    echo "Unsafe application root: ${app_root}" >&2
    exit 1
    ;;
esac

cleanup() {
  local exit_code=$?

  if [[ -n "${preflight_pid}" ]] && kill -0 "${preflight_pid}" 2>/dev/null; then
    kill "${preflight_pid}" 2>/dev/null || true
    wait "${preflight_pid}" 2>/dev/null || true
  fi

  if [[ -n "${staging_dir}" && -d "${staging_dir}" ]]; then
    case "${staging_dir}" in
      "${releases_dir}"/.*) rm -rf -- "${staging_dir}" ;;
    esac
  fi

  rm -f -- "${archive_path}"

  if (( exit_code != 0 )) && [[ -f "${preflight_log}" ]]; then
    echo "Last preflight log lines:" >&2
    tail -n 50 "${preflight_log}" >&2 || true
  fi

  exit "${exit_code}"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

wait_for_url() {
  local url="$1"
  local watched_pid="${2:-}"
  local attempt

  for attempt in $(seq 1 30); do
    if curl --fail --silent --show-error --max-time 5 "${url}" > /dev/null; then
      return 0
    fi

    if [[ -n "${watched_pid}" ]] && ! kill -0 "${watched_pid}" 2>/dev/null; then
      return 1
    fi

    sleep 1
  done

  return 1
}

restore_previous_release() {
  local previous_release="$1"
  local temporary_link="${app_root}/.rollback-${commit_sha}"

  echo "Deployment health check failed; restoring the previous release." >&2

  if [[ -n "${previous_release}" && -d "${previous_release}" ]]; then
    unlink "${temporary_link}" 2>/dev/null || true
    ln -s "${previous_release}" "${temporary_link}"
    mv -Tf "${temporary_link}" "${current_link}"
    APP_CURRENT_DIR="${current_link}" pm2 startOrReload \
      "${previous_release}/ecosystem.config.cjs" \
      --env production \
      --update-env
  elif [[ -d "${legacy_dir}" && -f "${legacy_dir}/dist/server/server.js" ]]; then
    unlink "${current_link}" 2>/dev/null || true
    pm2 delete 100web 2>/dev/null || true

    pm2 start pnpm \
      --name 100web \
      --cwd "${legacy_dir}" \
      -- \
      preview \
      --host 127.0.0.1 \
      --port 3000
  else
    echo "No previous release is available for automatic rollback." >&2
    return 1
  fi

  wait_for_url "http://127.0.0.1:3000/"
  pm2 save --force
}

mkdir -p "${releases_dir}" "${shared_dir}" "${logs_dir}"
chmod 700 "${shared_dir}"

if [[ ! -f "${shared_dir}/.env" && -f "${legacy_dir}/.env" ]]; then
  install -m 600 "${legacy_dir}/.env" "${shared_dir}/.env"
fi

staging_dir="$(mktemp -d "${releases_dir}/.${release_name}.XXXXXX")"
tar -xzf "${archive_path}" -C "${staging_dir}"

if [[ -f "${shared_dir}/.env" ]]; then
  ln -s "${shared_dir}/.env" "${staging_dir}/.env"
fi

export PATH="${deploy_home}/.local/share/pnpm:${deploy_home}/.local/bin:/usr/local/bin:/usr/bin:/bin"

for executable in node pnpm pm2 curl tar; do
  if ! command -v "${executable}" > /dev/null 2>&1; then
    echo "Required executable is unavailable: ${executable}" >&2
    exit 1
  fi
done

cd "${staging_dir}"
pnpm install --prod --frozen-lockfile

if [[ ! -f dist/server/server.js ]]; then
  echo "The production server bundle was not generated." >&2
  exit 1
fi

preflight_port=3101
if ss -H -ltn "sport = :${preflight_port}" | grep -q .; then
  echo "Preflight port ${preflight_port} is already in use." >&2
  exit 1
fi

HOST=127.0.0.1 PORT="${preflight_port}" NODE_ENV=production \
  pnpm start \
  > "${preflight_log}" 2>&1 &
preflight_pid=$!

if ! wait_for_url "http://127.0.0.1:${preflight_port}/" "${preflight_pid}"; then
  echo "The candidate release failed its isolated health check." >&2
  exit 1
fi

kill "${preflight_pid}" 2>/dev/null || true
wait "${preflight_pid}" 2>/dev/null || true
preflight_pid=""

mv "${staging_dir}" "${release_dir}"
staging_dir=""

previous_release=""
if [[ -L "${current_link}" ]]; then
  previous_release="$(readlink -f "${current_link}")"
fi

next_link="${app_root}/.next-${commit_sha}"
unlink "${next_link}" 2>/dev/null || true
ln -s "${release_dir}" "${next_link}"
mv -Tf "${next_link}" "${current_link}"

existing_cwd="$(
  pm2 jlist 2>/dev/null \
    | node -e 'let input=""; process.stdin.on("data", (chunk) => input += chunk); process.stdin.on("end", () => { const app = JSON.parse(input).find((item) => item.name === "100web"); process.stdout.write(app?.pm2_env?.pm_cwd || ""); });'
)"

if [[ -n "${existing_cwd}" && "${existing_cwd}" != "${current_link}" ]]; then
  pm2 delete 100web
fi

if pm2 describe 100web > /dev/null 2>&1; then
  pm2_command=(startOrReload)
else
  pm2_command=(start)
fi

if ! APP_CURRENT_DIR="${current_link}" pm2 "${pm2_command[@]}" \
    "${release_dir}/ecosystem.config.cjs" \
    --env production \
    --update-env; then
  restore_previous_release "${previous_release}"
  exit 1
fi

if ! wait_for_url "http://127.0.0.1:3000/"; then
  restore_previous_release "${previous_release}"
  exit 1
fi

pm2 save --force

mapfile -t release_history < <(
  find "${releases_dir}" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
    | sort -nr \
    | cut -d' ' -f2-
)

if (( ${#release_history[@]} > 2 )); then
  for old_release in "${release_history[@]:2}"; do
    case "${old_release}" in
      "${releases_dir}"/*)
        if [[ "${old_release}" != "${previous_release}" && "${old_release}" != "${release_dir}" ]]; then
          rm -rf -- "${old_release}"
        fi
        ;;
    esac
  done
fi

rm -f -- "${preflight_log}"
echo "Successfully deployed ${commit_sha}."
