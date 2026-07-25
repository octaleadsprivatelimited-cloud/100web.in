import crypto from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { pool } from "./db.server";

const COOKIE = "web_atlas_session";
const SESSION_DAYS = 14;

export type AuthUser = { id: string; email: string; full_name: string | null; role: "admin" | "editor" | "customer" };

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  await pool.query("INSERT INTO sessions(user_id, token_hash, expires_at) VALUES($1,$2,now()+$3::interval)", [userId, hash, `${SESSION_DAYS} days`]);
  setCookie(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_DAYS * 86400 });
}

export async function destroySession() {
  const token = getCookie(COOKIE);
  if (token) await pool.query("DELETE FROM sessions WHERE token_hash=$1", [crypto.createHash("sha256").update(token).digest("hex")]);
  setCookie(COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export async function currentUser(): Promise<AuthUser | null> {
  const token = getCookie(COOKIE);
  if (!token) return null;
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const { rows } = await pool.query<AuthUser>(`
    SELECT u.id,u.email,u.full_name,u.role
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=$1 AND s.expires_at>now() AND u.is_active=true
  `, [hash]);
  return rows[0] ?? null;
}
