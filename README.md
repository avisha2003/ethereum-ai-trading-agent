# Ethereum AI Trading Agent

A clean monorepo architecture containing both the backend and frontend services.

## Project Structure

```
project-root/
├── backend/            # Python backend (FastAPI, Web3, Gemini agent)
│   ├── main.py
│   ├── agent.py
│   ├── test-predictor.py
│   ├── pyproject.toml
│   └── ...
├── frontend/           # React frontend (Vite)
│   ├── src/
│   └── ...
└── README.md
```

## Running the Application

### 1. Backend

Navigate to the `backend` directory, install dependencies (if not already done), and run the FastAPI server:

```bash
cd backend
# Activate virtual environment
.venv\Scripts\activate  # Windows
# Or run uvicorn directly using uv or python
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend

Navigate to the `frontend` directory and start the React/Vite development server:

```bash
cd frontend
npm run dev
```
