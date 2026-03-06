# 🚀 ActivePilotAI (TechNova Agentic Support System)

> **An AI-Powered "Active Pilot" for E-Commerce Support**  
> Bridging the gap between a static FAQ bot and a real human sales assistant.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📖 What is this Project?

**ActivePilotAI** (powered by the TechNova engine) is an **Agentic AI-Driven Business Support System** designed to transform how e-commerce websites handle customer interactions.

Unlike traditional chatbots that sit passively in the corner, this system acts as an **"Active Website Operator."** It is deeply integrated into the website's frontend and backend, allowing it to:
1.  **Read Live Data**: Read real-time orders, inventory stock, and product specs.
2.  **Control the UI**: Navigate users to products autonomously on the frontend.
3.  **Detect Emotions**: Identify anger or frustration in real-time.
4.  **Execute Complex Handoffs**: Transfer session state, chat history, and context to human agents securely.

---

## ❓ Why is this Necessary?

Businesses today face a critical **"Support Bottleneck"**:
* **High Traffic, Low Attention:** Customers leave websites if they can't find products instantly.
* **The "Dumb Bot" Frustration:** Existing bots only answer generic questions. If a user asks *"Where is my order?"* or *"Show me gaming laptops,"* most bots fail, leading to anger.
* **Context Loss:** When a bot fails, the user is transferred to a human who asks *"How can I help?"*—forcing the user to repeat their entire problem. This essentially kills customer satisfaction.

**ActivePilotAI solves this** by creating a unified intelligence layer that remembers context, understands user intent, and acts proactively.

---

## ⚡ TechNova vs. Traditional FAQ Bots

| Feature | 🤖 Traditional FAQ Bot | 🧠 ActivePilotAI System |
| :--- | :--- | :--- |
| **Interaction Style** | **Passive:** "Here is a link, click it yourself." | **Active:** "I found it. Taking you there now." (Auto-Navigation) |
| **Context Memory** | **None:** Forgets you after every refresh. | **Stateful:** Remembers "it" refers to the drone you asked about. |
| **Knowledge Base** | **Static:** Hardcoded text responses. | **Dynamic:** Reads live product specs & order status instantly. |
| **Escalation** | **Blind:** Sends an email or generic ticket. | **Smart:** Analyzes sentiment & transfers full history. |
| **User Experience** | **Frustrating:** "I don't understand." | **Empathetic:** "I see you are upset. Let me help you out." |

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
* **Real-time Sentiment:** 🔴 Angry / 🟢 Happy
* **AI Summaries:** A 1-sentence breakdown of the incoming issue.
* **Suggested Solutions:** AI-generated next steps for the agent to resolve the issue quickly.

---

## 💻 Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Lucide React, React Router DOM.
* **Backend:** Python (FastAPI), Uvicorn, SQLAlchemy, Pydantic.
* **Database:** SQLite (Default for Local Dev) / PostgreSQL (via Docker).
* **AI Engine:** OpenAI GPT-4 API (via Custom Agentic Orchestrator).
* **State Management:** In-Memory Session Store (Optimized for low-latency).

---

## 🚀 Getting Started

Follow these steps to get the system running locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [Python](https://www.python.org/) (v3.9+)
* [Docker](https://www.docker.com/) (Optional, for PostgreSQL database)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/technova-agentic-support.git
cd technova-agentic-support
```

### Step 2: Backend Setup (The Brain)
Navigate to the `backend` folder and start the Python server.

```bash
cd backend

# 1. Create a virtual environment (Recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure API Key
# Copy the `.env.example` to `.env` in the root (or `backend` directory)
# Ensure you set your OpenAI API key:
# OPENAI_API_KEY=your_openai_api_key

# 4. Run the Server (Development)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Note: The backend will auto-initialize with a local SQLite DB `backend/technova.db` and seed sample data on the first run.*
> **Backend runs at: [http://localhost:8000](http://localhost:8000)**

#### Optional: Run PostgreSQL Backend via Docker
If you want to run a PostgreSQL instance instead of SQLite, you can use the provided Docker Compose configuration:
```bash
# From the root directory:
docker compose up -d
```
*(Once Postgres is running and `DATABASE_URL` is set in your `.env`, the backend detects it automatically.)*

### Step 3: Frontend Setup (The Interface)
Open a new terminal, navigate to the frontend folder, and start the React app.

```bash
# From the root directory, simply install and run Vite (The frontend is at the root)
npm install

# Run the development server
npm run dev
```
> **App runs at: [http://localhost:5173](http://localhost:5173)**

---

## 🎮 Usage Guide (Demo Script)

1. **Open User View:** Go to `http://localhost:5173`.
2. **Test Navigation:** Ask *"Show me the DJI Mini 3 Pro"* → Say *"Yes"* → Watch the page redirect automatically to the product page.
3. **Test Knowledge:** Ask *"Where is my order?"* (The AI will check the mock database).
4. **Test Escalation:** Say *"I am angry! I need an agent!"* The AI will detect the frustration and provide an access code.
5. **Open Admin View:** Go to `http://localhost:5173/admin` (or the respective admin route).
6. **Unlock Session:** Enter the escalation code. View the Sentiment Analysis, Chat History, and AI Summaries.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/yourusername/technova-agentic-support/issues).

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
