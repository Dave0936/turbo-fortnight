# Synergy Group Fitness

Website and members app for Synergy Group Fitness, imported from
[Dave0936/synergy-transfer](https://github.com/Dave0936/synergy-transfer) (commit `ba62e7d`).

- `frontend/` — React (CRA + craco, Tailwind, shadcn/ui) marketing site and `/app` members area
- `backend/` — FastAPI + MongoDB API (`server.py`): leads/enquiries, member auth, Resend emails
- `APP_SCOPING.md`, `design_guidelines.json`, `frontend/src/design-tokens.*` — app plan and design system
- `memory/PRD.md` — product requirements and build log

## Running locally

Frontend:

```bash
cd frontend
yarn install
yarn start
```

Backend (needs a `backend/.env` with `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `ADMIN_KEY`,
`ADMIN_PASSWORD`, and optionally `RESEND_API_KEY`, `SENDER_EMAIL`, `TEAM_EMAIL`):

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```
