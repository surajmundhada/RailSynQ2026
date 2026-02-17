# RailSynQ

## AI-Powered Smart Train Traffic Optimizer

**Live Demo:** https://railsynq.netlify.app/

---

## Overview

RailSynQ is a decision-support system for railway section controllers.  
It optimizes train precedence, crossings, and platform allocation to improve throughput and reduce delays.

The system combines constraint optimization and machine learning components to support fast and explainable scheduling decisions.

---

## Objectives

- Enable near real-time train scheduling (<1s response)
- Provide explainable optimization recommendations
- Simulate operational disruptions (Digital Twin)
- Support human-in-the-loop overrides
- Reduce congestion and delay

---

## Key Features

### Live Dashboard
Real-time train visualization, optimization suggestions, and KPIs.

### Simulation Mode
Test disruption scenarios and operational constraints.

### Manual Overrides
Allow controllers to modify system decisions.

### Analytics & Reports
Delay trends and throughput insights.

### Adaptive Optimization
Improves decisions using historical performance data.

---

## Tech Stack

### Backend
- Python
- FastAPI
- Uvicorn
- OR-Tools
- PyTorch
- RLlib

### Frontend
- React (Vite)
- TailwindCSS
- Shadcn/UI

### Database
- SQLite (default)
- PostgreSQL / TimescaleDB (optional)

---

## Project Structure

RailSynQ/
├── backend/
├── frontend/
├── README.md
└── LICENSE

---

## Running Locally

### Clone the Repository

git clone https://github.com/surajmundhada/RailSynQ.git

cd RailSynQ

### Backend Setup

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

### Frontend Setup

cd frontend
npm install
npm run dev

---

## Team

- Suraj Mundhada – Backend Optimization
- Yash Agiwal – Frontend
- Pranav Navandar – Database & Infrastructure
- Shubham Soni – Simulation & Reports

---

## License

MIT License
