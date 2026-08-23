const fs = require("node:fs");
const path = require("node:path");
const { parseEnv } = require("node:util");

const appCurrentDir = process.env.APP_CURRENT_DIR;

if (!appCurrentDir) {
  throw new Error("APP_CURRENT_DIR is required to start the production process.");
}

const appRoot = path.dirname(appCurrentDir);
const envFile = path.join(appCurrentDir, ".env");
const fileEnvironment = fs.existsSync(envFile) ? parseEnv(fs.readFileSync(envFile, "utf8")) : {};

module.exports = {
  apps: [
    {
      name: "100web",
      cwd: appCurrentDir,
      script: "pnpm",
      args: ["start"],
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      kill_timeout: 10000,
      listen_timeout: 10000,
      merge_logs: true,
      output: path.join(appRoot, "logs", "application.log"),
      error: path.join(appRoot, "logs", "error.log"),
      env_production: {
        ...fileEnvironment,
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "3000",
      },
    },
  ],
};
