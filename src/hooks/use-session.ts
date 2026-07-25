import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSessionUser } from "@/lib/auth.functions";

export type AppRole = "admin" | "editor" | "customer";
export function useSession() {
  const getUser = useServerFn(getSessionUser);
  const query = useQuery({ queryKey: ["session-user"], queryFn: () => getUser(), staleTime: 30_000 });
  const user = query.data ?? null;
  const roles = user ? [user.role as AppRole] : [];
  return { user, roles, isAdmin: user?.role === "admin", isEditor: user?.role === "admin" || user?.role === "editor", loading: query.isLoading };
}
