
# Recrux.AI - Intelligent Multi-Agent Job Matching

**Recrux.AI** is a state-of-the-art job discovery and matching platform powered by a multi-agent AI architecture. It leverages the power of Google's **Gemini 3 Flash Preview** and **LangGraph** to provide hyper-personalized job recommendations by analyzing resumes and matching them with real-world job descriptions.

---

## 🚀 Key Features

- **Multi-Agent Architecture**: Discrete AI agents for resume parsing, job searching, and match scoring.
- **Intelligent Resume Parsing**: Extracts skills, experience, and calculates ATS scores automatically.
- **Smart Job Matching**: Goes beyond keyword matching to understand context using LLMs.
- **Modern User Experience**: A sleek, reactive dashboard for managing resumes and tracking applications.
- **Standalone Agents**: Backend is designed with modularity, allowing agents to be tested and deployed independently.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **AI Orchestration**: [LangGraph](https://www.langchain.com/langgraph) & [LangChain](https://www.langchain.com/)
- **LLM**: Google **Gemini 3 Flash Preview**
- **File Parsing**: PyMuPDF (PDF) & python-docx (DOCX)
- **Data Handling**: Pydantic v2

---

## 📁 Project Structure

```bash
├── frontend/             # React Application (Vite)
│   ├── src/
│   │   ├── types/        # TypeScript Interfaces
│   │   ├── services/     # API & Logic services
│   │   ├── components/   # Layouts & UI components
│   │   ├── pages/        # Application screens
│   │   └── App.tsx       # Main Entry Point
│   └── package.json
│
└── backend/              # FastAPI Application
    ├── agents/           # AI Core (LangGraph)
    ├── routers/          # API Handlers
    ├── models/           # Data Schemas
    ├── utils/            # DB & Parsing Utils
    └── main.py           # Server Entry Point
```

---

## 🚦 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Copy .env.example to .env and add your GEMINI_API_KEY
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔮 Roadmap
- [ ] **Live Job API Integration**: Currently using mock data; integrating LinkedIn & JSearch APIs.
- [ ] **GCP Vector DB**: Moving from mockup to Google Cloud Vertex AI / Vector Search.
- [ ] **Auth System**: implementing Google OAuth and manual email/password auth.
- [ ] **Chatbot**: Integrated AI assistant for user queries based on profile data.

---

## 📄 License
Reserved for Recrux.AI Team.
