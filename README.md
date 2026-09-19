# Davy // portfolioOS

The public Terminal OS portfolio and a protected content management workspace. React, TypeScript, Vite, and Tailwind power the frontend; Express, TypeScript, Mongoose, and MongoDB power the API. Public content is fetched from MongoDB. The local data from the first landing page is available through an explicit seed script.

## Local setup

1. Install Node.js and a MongoDB server, or obtain a MongoDB connection URI.
2. Run `npm install` in the repository and `npm install` in `server/`.
3. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI`, `CLIENT_URL`, and a random `AUTH_SECRET` of at least 32 characters. Keep this file private. The default frontend URL is `http://localhost:5173`.
4. Set `ADMIN_USERNAME` and a strong `ADMIN_INITIAL_PASSWORD` in the server environment, then run `npm run create-admin --prefix server` once. This command refuses to overwrite an existing admin. Remove `ADMIN_INITIAL_PASSWORD` from the environment afterward.
5. Run `npm run seed --prefix server` to populate missing portfolio collections from the original landing page. It only inserts into empty collections and never overwrites existing documents.
6. In separate terminals, run `npm run dev:api` and `npm run dev`. Visit `http://localhost:5173`.

Type `admin` in the interactive terminal to enter the masked password flow. The password is verified by the API and the browser receives an HttpOnly session cookie. The `/manage` route and all `/api/manage/*` endpoints check that session. `POST /api/auth/logout` invalidates it.

## Media

Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `server/.env` to enable uploads. Images allow PNG, JPEG, WebP, and GIF up to 5 MB; CV files allow PDF up to 10 MB. The management UI requests a short-lived signed upload and sends the file directly to Cloudinary, avoiding Vercel's function body limit. The existing server upload endpoint still checks MIME type and file signature when used directly. MongoDB stores URLs and Cloudinary public IDs, not file bytes. Replaced and deleted managed assets are cleaned up after database writes. Uploads made for an unsaved or canceled form can remain in Cloudinary and should be reviewed manually.

## Vercel deployment

The root project deploys the Vite frontend and the Express API together. `vercel.json` routes `/api/*` to one Vercel Function and sends browser page routes to the SPA. Keep `VITE_API_URL` unset so the browser uses the same HTTPS domain for pages and API calls.

1. Run `vercel link` from the project root and select the intended Vercel team and project.
2. In Vercel's project settings, add `MONGODB_URI`, `AUTH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` as **Sensitive** Production environment variables. Copy only their values from the private `server/.env`; never upload that file or place these values in `VITE_` variables. Set `NODE_ENV=production` and `TRUST_PROXY=1`. The API derives its allowed frontend origin from Vercel's deployment URL and production URL. Do not add the local `CLIENT_URL` to Vercel.
3. Ensure the MongoDB Atlas network access policy permits the deployed function to connect. For an unrestricted public IP list, use a database user restricted to this portfolio database with only the permissions it needs.
4. Run `vercel deploy --prod` from the project root. Verify `/api/health`, `/api/profile`, `/api/auth/me`, a public page, and an admin login on the deployed HTTPS URL.

The `server/.env` file is for the separate local API process only. A Vercel deployment needs its own environment variables. If database credentials were ever exposed, rotate them before using them in production.

## Configuration and deployment

- The Vite dev server proxies `/api` to port 3000. Keep `VITE_API_URL` empty for local development, including Android device emulation and phones on the same LAN. A URL such as `http://localhost:3000` in `VITE_API_URL` makes a phone call its own port 3000 instead of the computer's API. Set `VITE_API_URL` only when production uses a separately hosted API. Do not put secrets in `VITE_` variables.
- Start both `npm run dev:api` and `npm run dev`; the Vite proxy cannot serve API requests while the Express server is stopped. For a physical phone, open the Vite Network URL shown in the terminal. Add that exact origin (for example `http://192.168.1.5:5173`) to `CLIENT_URLS` in `server/.env`, then restart the API. Keep `CLIENT_URL=http://localhost:5173` for desktop development. If the computer's LAN address changes, update `CLIENT_URLS`.
- `CLIENT_URL` must match the browser origin. Cookies use `HttpOnly`, `SameSite=Lax`, and `Secure` in production. For a cross-site HTTPS deployment, set `COOKIE_SAME_SITE=none` and use HTTPS on both sides.
- Set `TRUST_PROXY=1` only when exactly one trusted reverse proxy is in front of the API.
- The original profile contains placeholder contact and social URLs. Edit them through `/manage/profile` after seeding. Certificates begin empty.
- `npm run build` builds the frontend and `npm run build:api` builds the API. Run `npm run typecheck` and `npm run typecheck --prefix server` for strict TypeScript checks.
- `npm run test:integration --prefix server` starts a temporary MongoDB for API integration tests. The first run downloads a MongoDB binary; it does not touch your configured database.
- For browser QA without a persistent database, set a disposable `UI_TEST_PASSWORD` and run `npm run test:ui-server --prefix server`. This test-only process starts an in-memory database with sample content on port 3000; stopping it removes the data.

The public pages display terminal-style loading, empty, and retry states when API data is unavailable. The control panel handles profile, projects, skills, experience, certificates, appearance settings, and contact messages. Its forms call the protected API directly; refreshing the public page reflects saved records.
