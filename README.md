# Facebook-like landing page

This is a code bundle for Facebook-like landing page. The original project is available at https://www.figma.com/design/hETqHM5KYbFmSOVduMk1JU/Facebook-like-landing-page.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the frontend locally.

Run `npm run dev-backend` to start the frontend and backend for local development.

To access the app from another device on the same network, open the Vite URL shown in the terminal, for example `http://192.168.x.x:5173`.

## Use an Existing Render PostgreSQL Database

The backend reads `DATABASE_URL` from `backend/.env`.

Example:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE_NAME
PORT=5000
FRONTEND_URL=http://localhost:5173,https://facebooklike.onrender.com
```

Important notes:

- Keep the exact `External Database URL` from Render. Do not invent the host, user, or database name.
- The backend already tries to reuse existing tables and data in the `public` schema.
- On startup, the server runs compatibility checks for `users` and `messages` and only creates missing columns/tables when needed.
- Existing rows are preserved. The code does not drop tables or truncate data.

Recommended workflow:

1. In Render, open your PostgreSQL service and copy the `External Database URL`.
2. Paste that value into `backend/.env` as `DATABASE_URL=...`.
3. Start the backend from the `backend` folder with `npm start`, or from the repo root with `npm run dev-backend`.
4. If your existing database already has `users` and `messages` in the `public` schema, the app will use them.
5. If your old tables use legacy column names, the backend will try to rename them automatically to the names expected by the app.

If your existing data is in a different schema than `public`, you must either move it into `public` or update the SQL queries in the backend to target that schema.
