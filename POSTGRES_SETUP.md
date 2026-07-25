# PostgreSQL setup

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL` to the PostgreSQL connection string.
4. Set `DATABASE_SSL=false` for a local database, or leave SSL enabled for a hosted database.
5. Run `corepack pnpm db:setup`.
6. Start the application with `corepack pnpm dev`.

The setup command creates all tables, secure session storage, referral functions, and demo data.

## Demo logins

- Administrator: `admin.demo@yourdomain.com`
- Customer: `customer.demo@yourdomain.com`
- Password for both: `hello@1234`

Change both passwords before using the application in production.
