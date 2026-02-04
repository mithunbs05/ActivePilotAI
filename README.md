# 🚀 TechNova Agentic Support System
### *An AI-Powered "Active Pilot" for E-Commerce Support*

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

## 📖 What is this Project?

This project is an **Agentic AI-Driven Business Support System** designed to transform how e-commerce websites handle customer interaction.

Unlike traditional chatbots that sit passively in the corner, this system acts as an **"Active Website Operator."** It is deeply integrated into the website's frontend and backend, allowing it to:
1.  **Read live data** (Orders, Inventory).
2.  **Control the UI** (Navigate users to products autonomously).
3.  **Detect Emotions** (Identify anger/frustration in real-time).
4.  **Execute Complex Handoffs** (Transfer session state to human agents securely).

It bridges the gap between a static FAQ bot and a real human sales assistant.

---

## ❓ Why is this Necessary?

Businesses today face a critical **"Support Bottleneck"**:
* **High Traffic, Low Attention:** Customers leave websites if they can't find products instantly.
* **The "Dumb Bot" Frustration:** Existing bots only answer generic questions. If a user asks *"Where is my order?"* or *"Show me gaming laptops,"* most bots fail, leading to anger.
* **Context Loss:** When a bot fails, the user is transferred to a human who asks *"How can I help?"*—forcing the user to repeat their entire problem. This kills customer satisfaction.

**TechNova solves this** by creating a unified intelligence layer that remembers context, understands intent, and acts proactively.

---

## ⚡ Advantages: TechNova vs. Traditional FAQ Bots

| Feature | 🤖 Traditional FAQ Bot | 🧠 TechNova Agentic System |
| :--- | :--- | :--- |
| **Interaction Style** | **Passive:** "Here is a link, click it yourself." | **Active:** "I found it. Taking you there now." (Auto-Navigation) |
| **Context Memory** | **None:** Forgets you after every refresh. | **Stateful:** Remembers "it" refers to the drone you asked about 5 mins ago. |
| **Knowledge Base** | **Static:** Hardcoded text responses. | **Dynamic:** Reads live product specs & order status instantly. |
| **Escalation** | **Blind:** Sends an email or generic ticket. | **Smart:** Analyzes sentiment & transfers full history + AI summary to admin. |
| **User Experience** | **Frustrating:** "I don't understand." | **Empathetic:** "I see you are upset. Here is a priority code." |

---

## 🛠️ Key Features

### 1. 🧭 Agentic Navigation
The bot doesn't just talk; it drives. If a user asks for a specific product, the AI triggers a frontend router event to **automatically redirect** the user's screen to that product page.

### 2. 🧠 Context-Aware Intelligence (RAG-Lite)
The system injects real-time product catalogs and order databases into the AI's short-term memory. It can compare specs (e.g., *"Which drone has longer battery life?"*) with high accuracy.

### 3. 🛡️ Secure "Code-Based" Human Handoff
A privacy-first solution for connecting users to support.
* **User Side:** Receives a unique 4-digit OTP (e.g., `4257`) when escalation is needed.
* **Admin Side:** Enters the code to instantly unlock the user's full chat history, profile, and current problem.

### 4. 📊 Admin Insight Dashboard
A dedicated portal for support agents that visualizes:
* **Real-time Sentiment:** (🔴 Angry / 🟢 Happy)
* **AI Summaries:** A 1-sentence breakdown of the issue.
* **Suggested Solutions:** AI-generated next steps for the agent.

---

## 💻 Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Lucide React, React Router DOM.
* **Backend:** Python (FastAPI), Uvicorn.
* **AI Engine:** OpenAI GPT-4.1 Nano (via Custom Agentic Orchestrator).
* **State Management:** In-Memory Session Store (Optimized for low-latency).

---

## 🚀 How to Run the Project

Follow these steps to get the system running locally.

### Prerequisites
* Node.js (v18+)
* Python (v3.9+)

### Step 1: Clone the Repository
```bash
git clone [https://github.com/yourusername/technova-agentic-support.git](https://github.com/yourusername/technova-agentic-support.git)
cd technova-agentic-support
Step 2: Backend Setup (The Brain)
Navigate to the backend folder and start the Python server.

Bash
cd backend

# 1. Create a virtual environment (Optional but recommended)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# 2. Install dependencies
pip install fastapi uvicorn openai python-dotenv

# 3. Configure API Key
# Create a .env file and add:
# AI_API_KEY=your_openai_api_key
# AI_BASE_URL=[https://api.openai.com/v1](https://api.openai.com/v1) (or your custom provider)
# AI_MODEL_NAME=gpt-4.1-nano

# 4. Run the Server
uvicorn main:app --reload
Server runs at: http://localhost:8000

Step 3: Frontend Setup (The Interface)
Open a new terminal, navigate to the frontend, and start the React app.

Bash
cd frontend

# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
App runs at: http://localhost:5173

🎮 Usage Guide (Demo Script)
Open User View: Go to http://localhost:5173.

Test Navigation: Ask "Show me the DJI Mini 3 Pro" → Say "Yes" → Watch the page redirect.

Test Knowledge: Ask "Where is my order?" (It checks the mock DB).

Test Escalation: Say "I am angry! I need a human!". Note the Access Code provided.

Open Admin View: Go to http://localhost:5173/admin.

Unlock Session: Enter the code. View the Sentiment Analysis and Chat History.
