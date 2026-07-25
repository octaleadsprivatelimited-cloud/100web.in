import { createMiddleware } from "@tanstack/react-start";
import { currentUser } from "@/lib/auth.server";
import { postgres } from "@/lib/db.server";

export const requirePostgresAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  return next({ context: { db: postgres, userId: user.id, user } });
});
