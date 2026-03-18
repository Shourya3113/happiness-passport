# 🛂 Happiness Passport

A digital platform for tracking student holistic growth — achievements, emotional wellbeing, and personal goals — in one unified system.

---

## Project Structure

```
happiness-passport/
├── backend/              # Flask API
│   ├── app/
│   │   ├── __init__.py   # App factory
│   │   ├── config.py
│   │   ├── models/       # SQLAlchemy models
│   │   ├── routes/       # Blueprint routes
│   │   └── utils/        # PDF & QR generators
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
│
└── frontend/             # React + Tailwind
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── contexts/     # AuthContext
    │   ├── services/     # Axios API layer
    │   ├── pages/
    │   │   ├── auth/     # Login, Register
    │   │   ├── student/  # Dashboard, Achievements, Goals, Emotions, Passport
    │   │   ├── faculty/  # Dashboard, Verify, Issue Certificate
    │   │   └── admin/    # Dashboard, Leaderboard
    │   └── components/
    │       └── common/   # AppLayout (sidebar)
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Setup Guide

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL running locally

---

### 1. Database Setup

Open `psql` and create the database:

```sql
CREATE DATABASE happiness_passport;
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL, SECRET_KEY, JWT_SECRET_KEY

# Run database migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Start the backend server
python run.py
# API running at http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
# App running at http://localhost:5173
```

---

## 🧭 User Roles

| Role    | Access |
|---------|--------|
| Student | Dashboard, Achievements, Goals, Emotion Check, Passport |
| Faculty | Dashboard, Verify Achievements, Issue Certificates |
| Admin   | Dashboard (analytics), Leaderboard |

Register at `/register` and select your role.

---

## 🔑 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/achievements/` | List achievements |
| POST | `/api/achievements/` | Submit achievement |
| PATCH | `/api/achievements/:id/verify` | Verify/reject (faculty) |
| GET | `/api/goals/` | List goals |
| POST | `/api/goals/` | Create goal |
| PATCH | `/api/goals/:id` | Update progress |
| GET | `/api/emotions/` | List emotion logs |
| POST | `/api/emotions/` | Log emotion |
| GET | `/api/emotions/summary` | Emotion summary stats |
| POST | `/api/certificates/issue` | Issue certificate (faculty) |
| GET | `/api/certificates/verify/:uuid` | Public QR verification |
| GET | `/api/passport/me` | Full passport data |
| GET | `/api/admin/stats` | Admin analytics |
| GET | `/api/admin/leaderboard` | Top students |

---

## 🧩 Tech Stack

- **Frontend:** React 18, React Router, Tailwind CSS, Recharts, Axios
- **Backend:** Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended
- **Database:** PostgreSQL
- **Other:** ReportLab (PDF), qrcode (QR), bcrypt (auth)

---

## 🔐 Environment Variables (backend/.env)

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=postgresql://postgres:password@localhost:5432/happiness_passport
UPLOAD_FOLDER=uploads
FRONTEND_URL=http://localhost:5173
```

---

## 📦 Next Steps

- [ ] Add email notifications for achievement verification
- [ ] Build admin user management panel
- [ ] Add event management for faculty
- [ ] Mobile-responsive polish
- [ ] Deploy with Docker Compose
