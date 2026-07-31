# 🎙️ Mock Interview AI Agent (Prepr)

An intelligent, real-time **AI-powered voice mock interview platform** designed to help candidates prepare for technical and behavioral interviews. Powered by **OpenAI's Realtime Voice API (WebRTC & WebSockets)**, the AI agent dynamically adapts its interview questions based on your **Resume**, target **Job Description (JD)**, or **GitHub Repositories**.

---

## ✨ Features

- **🎤 Real-Time Voice Interaction**: Low-latency, bidirectional audio streaming with AI using OpenAI Realtime WebRTC & WebSocket sideband channels.
- **📄 Resume-Based Interviews**: Upload your resume (PDF) to get tailored questions targeting your past projects, work history, and technical stack.
- **🎯 Job Description (JD) Alignment**: Paste target job specifications to simulate actual interview scenarios customized to company requirements.
- **🐙 GitHub Repository Analysis**: Fetch profile and repository metadata to evaluate technical architecture choices and engineering trade-offs.
- **📊 Performance Analytics & Feedback**: Detailed scoring and feedback metrics including clarity, depth, relevance, total score, and gap analysis.
- **🔐 Secure User Authentication**: Authentication powered by Clerk for seamless user sign-in and account management.
- **🌓 Modern UI & Responsive Design**: Built with React 19, Vite, Tailwind CSS v4, Radix/Base UI components, and theme switching.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **Authentication**: [@clerk/react](https://clerk.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Server Framework**: [Express.js v5](https://expressjs.com/)
- **Database & ORM**: [PostgreSQL 17](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication Middleware**: [@clerk/express](https://clerk.com/)
- **AI & WebSockets**: [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime), [ws](https://github.com/websockets/ws)
- **PDF Parsing**: `pdf-parse`

### **Infrastructure & DevOps**
- **Containerization**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)
- **Database Management**: Drizzle Kit (Migrations & Studio UI)

---

## 📁 Repository Structure

```text
mock-interview-ai-agent/
├── backend/
│   ├── src/
│   │   ├── DB/                  # Drizzle ORM database schemas & connections
│   │   │   └── schema.ts        # Users, Resumes, Conversations, Stats, & Metadata schemas
│   │   ├── module/              # Feature modules
│   │   │   ├── auth/            # Clerk authentication webhooks & sync handlers
│   │   │   ├── session/         # Realtime WebRTC audio interview session setup
│   │   │   ├── sideband/        # WebSocket sideband context & real-time monitoring
│   │   │   ├── resume parsing/  # PDF resume text extraction & storage
│   │   │   ├── github parsing/  # GitHub repository & profile fetching
│   │   │   └── JD parsing/      # Job description metadata processing
│   │   ├── common/              # Global helpers, error handling, & middleware
│   │   ├── index.ts             # App entry initialization
│   │   └── server.ts            # Express server configuration & route definitions
│   ├── drizzle.config.ts        # Drizzle ORM configuration
│   ├── Dockerfile               # Backend Docker container definition
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components & interview audio interface
│   │   ├── pages/               # Application landing & main pages
│   │   ├── routes/              # TanStack file-based routes
│   │   ├── services/            # API client configurations
│   │   ├── App.tsx              # Application layout wrapper
│   │   └── main.tsx             # React entrypoint & provider initializations
│   ├── vite.config.ts           # Vite bundler configuration
│   └── package.json
│
├── docker-compose.yml           # Multi-container orchestration (Backend + Postgres)
└── README.md
```

---

## ⚙️ Environment Variables

### 1. Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/interview_ai

# Clerk Auth Keys
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI Realtime Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_REALTIME_MODEL=gpt-realtime-2.1-mini
OPENAI_REALTIME_VOICE=verse
```

### 2. Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed locally:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [pnpm](https://pnpm.io/) or `npm`
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) *(optional, for containerized run)*
- PostgreSQL instance *(if running without Docker)*

---

### Option A: Running with Docker Compose (Recommended)

1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/amritrajputt/prepr.git
   cd prepr
   ```

2. Configure `backend/.env` and `frontend/.env` as shown above.

3. Start PostgreSQL database and backend using Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

4. Start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

---

### Option B: Local Manual Setup

#### 1. Setup Backend

```bash
cd backend
pnpm install

# Run database migrations with Drizzle Kit
pnpm generate
pnpm migrate

# Start backend dev server
pnpm dev
```
The backend server will run on `http://localhost:3000`.

#### 2. Setup Frontend

```bash
cd frontend
npm install

# Start frontend dev server
npm run dev
```
The frontend web app will run on `http://localhost:5173`.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/session/realtime-session` | Initiates WebRTC SDP offer exchange with OpenAI Realtime API |
| `POST` | `/api/resume/upload` | Uploads and parses candidate PDF resume |
| `POST` | `/api/github/metadata` | Fetches GitHub profile/repository metadata |
| `POST` | `/api/jd/metadata` | Stores target Job Description for customized sessions |
| `GET`  | `/protected` | Verified endpoint checking Clerk authentication token |

---

## 🛠️ Scripts Reference

### Backend (`/backend`)
- `pnpm dev` – Starts the development server with live watch mode using `tsc-watch`.
- `pnpm build` – Compiles TypeScript files to output directory `dist/`.
- `pnpm start` – Runs the built JavaScript server from `dist/server.js`.
- `pnpm generate` – Generates database SQL migrations via Drizzle Kit.
- `pnpm migrate` – Applies pending database migrations.
- `pnpm studio` – Opens Drizzle Studio to inspect and edit database records visually.

### Frontend (`/frontend`)
- `npm run dev` – Starts Vite development server.
- `npm run build` – Builds production bundle (`tsc -b && vite build`).
- `npm run preview` – Locally previews production build.
- `npm run lint` – Runs ESLint checks across codebase.

---

## 📝 License

This project is licensed under the [ISC License](LICENSE).
