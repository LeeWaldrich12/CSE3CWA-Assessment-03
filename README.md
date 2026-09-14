# AI Capsule

AI Capsule is a full-stack application that allows authenticated users to create, view, update, and delete saved AI prompts.

## Deployment

**Public URL:** https://cse3cwa-assessment-03.onrender.com  
**Cloud platform:** Render  
**Health check:** https://cse3cwa-assessment-03.onrender.com/api/health

Expected health response:

```json
{"status":"ok"}
```

## Technology

- React and Vite frontend
- Node.js and Express backend
- SQLite database
- GitHub OAuth
- Express-generated JWT
- Render deployment

## Setup

Clone the repository:

```bash
git clone https://github.com/LeeWaldrich12/CSE3CWA-Assessment-03.git
cd CSE3CWA-Assessment-03
```

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend normally runs at `http://localhost:5173`, while Express runs at `http://localhost:5000`.

## Environment Variables

Create `server/.env` with these variable names:

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
SESSION_SECRET=
JWT_SECRET=
CLIENT_URL=
GITHUB_CALLBACK_URL=
NODE_ENV=
```

Secret values are not included in the repository or README.

## Required Routes

- `GET /api/health` provides the public health check.
- `GET /api/capsules` reads the authenticated user's records.
- `POST /api/capsules` creates a record.
- `PUT /api/capsules/:id` updates a record.
- `DELETE /api/capsules/:id` deletes a record.

The React frontend communicates with Express using relative `/api` and `/auth` paths.

## Authentication and Ownership

The user signs in through GitHub OAuth. After successful authentication, Express creates its own JWT and stores it in a Secure, HttpOnly cookie named `token`.

JWT middleware protects every `/api/capsules` route. Missing or invalid tokens return `401 Unauthorized`.

The backend obtains `user_id` from the verified JWT, not from the frontend. GET filters records by the authenticated user ID. UPDATE and DELETE require both the record ID and authenticated user ID.

## Database and Storage

SQLite stores the capsule records. The database is created automatically when server starts, no configuration needed since there is no seperate databse server.

Each capsule is connected to the logged-in user through user_id. It comes from the verified JWT and not from the frontend. This prvents uses from choosing a different user ID or accessing someone else's records.

## Required cURL Tests

No authentication:

```bash
curl -i https://cse3cwa-assessment-03.onrender.com/api/capsules
```

Result:

```text
401 Unauthorized
```

Invalid JWT:

```bash
curl -i -H "Cookie: token=fake-token-123" https://cse3cwa-assessment-03.onrender.com/api/capsules
```

Result:

```text
401 Unauthorized
```

## AI-Assisted Development

Microsoft Copilot assisted with React, Express, SQLite, OAuth, JWT, deployment, debugging and README formatting.

Some issues i found would be that Copilot would change by establised field name like 'prompt_title' into 'title', or it helped me in finding slight misspelling on my end such as a linger '/' or 'capsules' instead of 'capsule'.

Other debugging assistance was when I was testing the working OAuth, and noticed my dashboard is empty, but not showing error message, it turns out i had to restart the backend and close the existing tab, and create a new one.

Others include when attempting to deploy in render, Render was attempting to deploy an older version despite the github is up to date, copilot helped navigate render for the force manual deployment, and also helped me find i accidentally left a trailing '/' in both my code the the render env variable for client_url.

## Limitation

The application has the SQLite database file stored on Render. Render's local storage is temporary, so the capsules, even if saved, could be lost if the Render service is restarted or redeployed.

## Implementation Decision
Despite Renders limitation, I chose to use it so React frontend and Express frontend can use the same public URL, to simplify the API requests, GitHub OAuth redirects and JWT configuration. Since I did not need to manage the frontend and backend domains seperately.