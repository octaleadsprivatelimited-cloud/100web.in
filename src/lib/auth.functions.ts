import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession, currentUser, destroySession } from "./auth.server";
import { pool } from "./db.server";

export const login = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ email: z.string().email(), password: z.string().min(8) }).parse(input))
  .handler(async ({ data }) => {
    const { rows } = await pool.query("SELECT id,email,password_hash,full_name,role,is_active FROM users WHERE lower(email)=lower($1)", [data.email]);
    const user = rows[0];
    if (!user || !user.is_active || !(await bcrypt.compare(data.password, user.password_hash))) throw new Error("Invalid email or password");
    await createSession(user.id);
    return { id: user.id, email: user.email, full_name: user.full_name, role: user.role };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => { await destroySession(); return { ok: true }; });
export const getSessionUser = createServerFn({ method: "GET" }).handler(async () => currentUser());

export const acceptInvite = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ token: z.string().uuid(), email: z.string().email(), password: z.string().min(8), full_name: z.string().min(2) }).parse(input))
  .handler(async ({ data }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const inviteResult = await client.query("SELECT * FROM customer_invites WHERE token=$1 AND lower(email)=lower($2) AND accepted_at IS NULL AND expires_at>now() FOR UPDATE", [data.token, data.email]);
      const invite = inviteResult.rows[0];
      if (!invite) throw new Error("Invalid, expired, or already used invitation");
      const hash = await bcrypt.hash(data.password, 12);
      const userResult = await client.query("INSERT INTO users(email,password_hash,full_name,role) VALUES(lower($1),$2,$3,'customer') RETURNING id,email,full_name,role", [data.email, hash, data.full_name]);
      const user = userResult.rows[0];
      const accountResult = await client.query("INSERT INTO customer_accounts(user_id,account_number,billing_name,billing_email,company) VALUES($1,'CUST-'||upper(substr(replace($1::text,'-',''),1,8)),$2,$3,$4) RETURNING id", [user.id, data.full_name, data.email, invite.company]);
      if (invite.referral_lead_id) await client.query("UPDATE referral_leads SET referred_customer_id=$1,status='invited' WHERE id=$2", [accountResult.rows[0].id, invite.referral_lead_id]);
      await client.query("UPDATE customer_invites SET accepted_at=now(),accepted_user_id=$1 WHERE id=$2", [user.id, invite.id]);
      await client.query("COMMIT");
      await createSession(user.id);
      return user;
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  });
