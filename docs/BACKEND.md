# Connecting your backend

You mentioned a backend folder that could not be attached in chat. Use either approach:

## Option A — Copy into this repo

1. Copy your backend folder to `c:\SonicSentinel\backend` (sibling to `src` and `android`).
2. Start the server (example): `cd backend && npm start`
3. Edit `src/config/api.ts`:
   - Emulator: `http://10.0.2.2:PORT/api`
   - Physical device: `http://YOUR_PC_LAN_IP:PORT/api`
4. Match route paths in `API_ENDPOINTS` to your API.

## Option B — Keep backend elsewhere

Only change `API_BASE_URL` in `src/config/api.ts` to your deployed URL.

## Expected API shape (adjust to match yours)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | `{ email, password }` → `{ token, user }` |
| `/auth/signup` | POST | `{ name, email, password }` |
| `/acoustic/health` | GET | Exposure summary |
| `/acoustic/alerts` | GET | Alert list |
| `/acoustic/heatmap` | GET | `{ points: [{ latitude, longitude, weight }] }` |

After the server runs, replace demo data in screens with calls from `src/services/api.ts`.
