# ETHOS — Ethical AI Trust Orchestration System

> A full-stack AI governance and transparency platform for banking decisions.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts, Framer-like animations |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Styling | Custom CSS with CSS Variables, Google Fonts (Syne + DM Sans) |

---

## 📁 Project Structure

```
ethos/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema (customer/admin)
│   │   ├── Decision.js       # Full decision + TrustCard schema
│   │   └── AuditLog.js       # Immutable audit trail
│   ├── routes/
│   │   ├── auth.js           # Register, login, profile
│   │   ├── decisions.js      # Apply, list, detail, stats
│   │   ├── consent.js        # Get/update consent preferences
│   │   ├── audit.js          # View audit logs
│   │   ├── admin.js          # Admin dashboard, reviews
│   │   └── ai.js             # Direct AI model endpoint
│   ├── services/
│   │   └── ethosEngine.js    # Core ETHOS processing pipeline
│   ├── middleware/
│   │   └── auth.js           # JWT protect + role authorize
│   ├── server.js             # Express app entry
│   ├── seed.js               # Database seeder
│   └── .env.example
│
└── frontend/
    └── src/
        ├── hooks/
        │   └── useAuth.js        # Auth context + hooks
        ├── utils/
        │   └── api.js            # Axios instance with interceptors
        ├── components/
        │   ├── Navbar.js         # Responsive navbar
        │   └── DashboardLayout.js
        └── pages/
            ├── LandingPage.js    # Hero + carousel + CTA
            ├── LoginPage.js      # Auth forms (login + register)
            ├── RegisterPage.js
            ├── CustomerDashboard.js
            ├── ApplyPage.js      # Multi-step loan application
            ├── DecisionDetailPage.js  # TrustCard view
            ├── MyDecisionsPage.js
            ├── ConsentPage.js    # Consent Studio
            ├── AdminDashboard.js
            ├── AdminDecisionsPage.js
            ├── AuditLogPage.js
            └── ProfilePage.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017 (or Atlas URI)

### 1. Backend Setup

```bash
cd ethos/backend
npm install
cp .env.example .env
# Edit .env if needed
node seed.js          # Seeds demo data
npm run dev           # Starts on port 5000
```

### 2. Frontend Setup

```bash
cd ethos/frontend
npm install
npm start             # Starts on port 3000
```

### 3. Open Browser
- http://localhost:3000

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | demo@ethos.com | demo123 |
| Admin | admin@ethos.com | admin123 |

---

## ⚙️ ETHOS Processing Pipeline

When a customer submits a loan application, ETHOS runs:

```
1. AI Model Scoring       → Credit score, income ratio, DTI analysis
2. Consent Validation     → Checks data categories against user preferences
3. Feature Importance     → SHAP-like analysis of key decision factors
4. Bias Analysis          → Gender, age, income bias scoring
5. Fairness Evaluation    → Overall fairness score calculation
6. TrustCard Generation   → Plain-language explanation + suggestions
7. Audit Logging          → Immutable event stored in MongoDB
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Sign in |
| GET | /api/auth/me | Current user |
| PUT | /api/auth/profile | Update profile |

### Decisions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/decisions/apply | Submit application |
| GET | /api/decisions/my | User's decisions |
| GET | /api/decisions/:id | Decision detail |
| GET | /api/decisions/stats/summary | User stats |

### Consent
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/consent | Get preferences |
| PUT | /api/consent | Update preferences |

### Admin (admin role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Full governance stats |
| GET | /api/admin/decisions | All decisions |
| PUT | /api/admin/decisions/:id/review | Review flagged decision |
| GET | /api/admin/users | All customers |

### Audit
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/audit/my | User's audit trail |
| GET | /api/audit/all | All logs (admin) |

---

## 🎨 Design System

- **Primary Font**: Syne (display/headings)
- **Body Font**: DM Sans
- **Mono Font**: DM Mono
- **Theme**: Light — Navy (#0A2463) + Mint (#00C2A8) + Royal Blue (#1E50C8)
- **Effects**: Custom cursor, particle hero, infinite carousel, smooth transitions
