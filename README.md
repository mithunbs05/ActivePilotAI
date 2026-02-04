# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# TechNova — Local Development

This repository can run with either a local SQLite database (default) or a PostgreSQL database via Docker Compose.
## Quick: Run backend locally (SQLite fallback)

1. Install Python dependencies (use a venv):
```powershell
cd d:\temp\test\CPY\backend
python -m pip install -r requirements.txt
2. Start the backend (development):

```powershell
cd d:\temp\test\CPY\backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
The backend will auto-initialize the SQLite DB `backend/technova.db` and seed sample data on first run.

API endpoints:
- GET `/api/products`
- GET `/api/products/{id}`
- POST `/api/auth/login`
- GET `/api/users/{id}`
- GET `/api/orders/{user_id}`
- POST `/api/orders`

## Docker (Postgres) — Troubleshooting

`docker-compose.yml` is included to start a local PostgreSQL instance.
1. Ensure Docker Desktop (or Docker Engine) is installed and running on Windows.
	- On Windows, start Docker Desktop from Start Menu.
	- If using WSL2 backend, ensure WSL2 is running and integration enabled.
2. Copy `.env.example` to `.env` and (optionally) adjust the `DATABASE_URL`:

```powershell
cd d:\temp\test\CPY
copy .env.example .env
3. Start services:

```powershell
cd d:\temp\test\CPY
docker compose up -d
4. Confirm containers:

```powershell
docker compose ps
Common Docker errors and fixes:
- "The system cannot find the file specified" referencing `dockerDesktopLinuxEngine`: Docker Desktop is not running. Start Docker Desktop and try again.
- If `docker compose` is not found, install Docker CLI / Docker Desktop.

## Switching backend to Postgres

Once Postgres is running and `DATABASE_URL` is set in your environment (or in `.env`), the backend will detect `DATABASE_URL` and use Postgres instead of SQLite. To apply the change, restart the backend process.

## Notes

- The backend supports SQLite fallback so you can develop without Docker.
- If you want me to attempt starting containers after you confirm Docker is running, tell me and I'll retry.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
