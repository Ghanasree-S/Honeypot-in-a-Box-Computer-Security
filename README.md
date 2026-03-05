# 🍯 Honeypot-in-a-Box — Computer Security Dashboard

> A full-stack honeypot security system that deploys fake vulnerable endpoints, detects and classifies attacks using Machine Learning, and visualizes threats in real-time on a modern dashboard.

![License](https://img.shields.io/badge/license-Educational-blue)
![Python](https://img.shields.io/badge/Python-3.11-yellow)
![React](https://img.shields.io/badge/React-19-61dafb)
![Flask](https://img.shields.io/badge/Flask-3.0-black)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Attack Types (10 Classifications)](#-attack-types-10-classifications)
- [How It Works](#-how-it-works)
- [Setup & Installation](#-setup--installation)
- [Running the Project](#-running-the-project)
- [Attack Simulation](#-attack-simulation)
- [API Endpoints](#-api-endpoints)
- [ML Model Details](#-ml-model-details)
- [Deployment](#-deployment)

---

## 🔍 Overview

**Honeypot-in-a-Box** is a deception-based cybersecurity tool designed for educational and research purposes. It deploys fake "vulnerable" endpoints (login pages, admin panels, config files, etc.) that look real to attackers. When an attacker interacts with these endpoints, the system:

1. **Logs** the attack details (IP, payload, user-agent, timestamp)
2. **Classifies** the attack type using an ML model (Random Forest with 97%+ accuracy)
3. **Geolocates** the attacker using MaxMind GeoIP
4. **Visualizes** everything on a real-time dashboard with charts, maps, and alerts
5. **Notifies** the admin via SSE (Server-Sent Events) with audio + visual alerts

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        ATTACKER                                  │
│              (Phone/Browser via QR Code)                         │
│          Scans QR → Opens attacker.html → Clicks attack          │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTP Request (malicious payload)
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FLASK BACKEND (Port 5000)                      │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐  │
│  │  Honeypot    │  │  ML Model    │  │  GeoIP Lookup           │  │
│  │  Trap        │→ │  (Random     │→ │  (MaxMind GeoLite2)     │  │
│  │  Endpoints   │  │   Forest)    │  │  IP → Country/City/Lat  │  │
│  └─────────────┘  └──────────────┘  │        /Lon              │  │
│         │                            └─────────────────────────┘  │
│         ▼                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐  │
│  │  SQLite DB   │  │  SSE Stream  │  │  PDF Report Generator   │  │
│  │  (Attack     │  │  (Real-time  │  │  (ReportLab)            │  │
│  │   Logs)      │  │   push)      │  │                         │  │
│  └─────────────┘  └──────┬───────┘  └─────────────────────────┘  │
│                          │                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Auth System (JWT) — Signup/Login/Token Verification        │  │
│  └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ SSE + REST API
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                 REACT FRONTEND (Port 5173)                        │
│                                                                   │
│  ┌────────────┐ ┌──────────────┐ ┌────────────┐ ┌─────────────┐ │
│  │ Live Threat│ │  Analytics   │ │  World Map │ │  AI Chat    │ │
│  │ Feed       │ │  Dashboard   │ │  (Leaflet) │ │  (Gemini)   │ │
│  │            │ │  (Recharts)  │ │            │ │             │ │
│  └────────────┘ └──────────────┘ └────────────┘ └─────────────┘ │
│  ┌────────────┐ ┌──────────────┐ ┌────────────┐ ┌─────────────┐ │
│  │ Node       │ │  IP Blocking │ │  Search &  │ │  PDF Export │ │
│  │ Management │ │              │ │  Filter    │ │             │ │
│  └────────────┘ └──────────────┘ └────────────┘ └─────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🎯 Honeypot Trap System
- 10 fake vulnerable endpoints that mimic real systems
- Fake login pages, admin panels, database backups, config files
- Returns realistic-looking fake responses to trick attackers

### 🤖 ML-Powered Attack Classification
- **Random Forest Classifier** trained on web attack payloads
- **97%+ accuracy** on attack detection
- **Pattern-based fallback** when ML model is unavailable
- Classifies into **10 distinct attack categories**

### 📊 Real-Time Dashboard
- **Live Threat Feed** — attacks appear instantly via SSE
- **Analytics Charts** — pie charts, bar charts, area charts (Recharts)
- **World Map** — attack origins visualized on Leaflet map with GeoIP
- **Severity Distribution** — critical/high/medium/low breakdown
- **Top Attackers Leaderboard** — ranked by attack count
- **Search & Filter** — find specific threats by IP, type, or location

### 🔐 Authentication System
- JWT-based signup/login
- Token verification and protected routes
- Password change functionality

### 🤖 AI Security Analyst (SENTINEL)
- Google Gemini AI integration
- Ask questions about threats, get firewall recommendations
- Cybersecurity knowledge assistant

### 📱 Mobile Attack Simulator
- **QR Code generator** — scan to open attack page on phone
- **10 attack buttons** — one-tap attack simulation
- Works on local network and cloud deployment

### 📄 PDF Report Generation
- One-click PDF export of attack statistics
- Executive summary, attack type breakdown, top countries, recent logs

### 🔔 Alert System
- Red flashing screen border on new attacks
- Audio alert sounds
- Email alert configuration (simulated)
- Attack notification popups

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type-safe development |
| **Vite** | Build tool & dev server |
| **Framer Motion** | Animations & transitions |
| **Recharts** | Analytics charts (Pie, Bar, Area) |
| **Leaflet / React-Leaflet** | Interactive world map |
| **Lucide React** | Icon library |
| **Google Gemini API** | AI chat assistant |
| **TailwindCSS** | Styling |

### Backend
| Technology | Purpose |
|---|---|
| **Flask** | Python web framework |
| **Flask-SQLAlchemy** | ORM for database |
| **SQLite** | Database (attack logs + users) |
| **scikit-learn** | ML model (Random Forest) |
| **MaxMind GeoIP2** | IP geolocation |
| **PyJWT** | Authentication tokens |
| **ReportLab** | PDF report generation |
| **Flask-CORS** | Cross-origin support |
| **Gunicorn** | Production WSGI server |

---

## 📁 Project Structure

```
honeypot-security-dashboard/
│
├── 📄 App.tsx                     # Main React application (dashboard, threats, nodes)
├── 📄 index.html                  # HTML entry point
├── 📄 index.tsx                   # React entry point
├── 📄 index.css                   # Global styles
├── 📄 types.ts                    # TypeScript type definitions
├── 📄 package.json                # Frontend dependencies
├── 📄 vite.config.ts              # Vite configuration (proxy to Flask)
├── 📄 tsconfig.json               # TypeScript configuration
│
├── 📂 components/                 # React components
│   ├── AIChat.tsx                 # AI security analyst chatbot (Gemini)
│   ├── AnalyticsDashboard.tsx     # Charts & statistics page
│   ├── ArtistCard.tsx             # Threat card component (reusable)
│   ├── AuthPage.tsx               # Login/Signup page
│   ├── CustomCursor.tsx           # Custom cursor effect
│   ├── FluidBackground.tsx        # Animated background
│   ├── GlitchText.tsx             # Gradient text effect for headings
│   ├── LoginPage.tsx              # Login form component
│   └── WorldMap.tsx               # Leaflet world map with attack markers
│
├── 📂 contexts/
│   └── AuthContext.tsx             # Authentication context (JWT management)
│
├── 📂 services/
│   ├── api.ts                     # Backend API service (fetch, SSE, block IP)
│   └── geminiService.ts           # Google Gemini AI integration
│
├── 📂 public/
│   ├── attacker.html              # 📱 Attack simulator page (10 attack buttons)
│   └── qrcode.html                # 📱 QR code generator (for mobile demo)
│
├── 📂 backend/                    # Flask backend
│   ├── app.py                     # Flask app entry point
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Environment variables
│   │
│   ├── 📂 models/
│   │   ├── log_entry.py           # AttackLog SQLAlchemy model
│   │   ├── ml_model.py            # ML classifier + pattern-based detection
│   │   ├── classifier.pkl         # Trained Random Forest model
│   │   └── vectorizer.pkl         # TF-IDF Vectorizer for payloads
│   │
│   ├── 📂 routes/
│   │   ├── honeypot.py            # Honeypot trap endpoints + threat API
│   │   ├── dashboard.py           # Statistics & analytics API
│   │   ├── auth.py                # Authentication (signup/login/JWT)
│   │   └── reports.py             # PDF report generation endpoint
│   │
│   ├── 📂 utils/
│   │   ├── geoip.py               # MaxMind GeoIP2 lookup
│   │   ├── report_gen.py          # ReportLab PDF generator
│   │   └── sse.py                 # Server-Sent Events announcer
│   │
│   ├── 📂 data/
│   │   ├── GeoLite2-City.mmdb     # MaxMind GeoIP database
│   │   ├── training_data.csv      # ML training dataset
│   │   └── WEB_APPLICATION_PAYLOADS.jsonl  # Attack payload samples
│   │
│   └── 📂 scripts/
│       ├── train_model.py         # Train the Random Forest classifier
│       ├── evaluate_model.py      # Evaluate model accuracy
│       ├── convert_dataset.py     # Convert raw payloads to training CSV
│       └── benchmark.py           # Model performance benchmark
│
└── 📂 docs/
    └── Project_Documentation.html # Detailed HTML documentation
```

---

## 🎯 Attack Types (10 Classifications)

| # | Attack Type | Severity | Description | Trap Endpoint |
|---|---|---|---|---|
| 1 | 💉 **SQL Injection** | 🔴 Critical | Database query manipulation via malicious SQL | `/login` (POST) |
| 2 | 🎭 **XSS (Cross-Site Scripting)** | 🟠 High | Script injection to steal cookies/sessions | `/login` (POST) |
| 3 | ⚡ **Command Injection** | 🔴 Critical | OS command execution via input fields | `/login` (POST) |
| 4 | 📁 **Directory Traversal** | 🟠 High | Path manipulation to access system files | `/backup/../../../etc/passwd` |
| 5 | 🔐 **Reconnaissance** | 🟢 Low | Probing endpoints without payloads | `/wp-admin`, `/api/admin` |
| 6 | 🔑 **Suspicious Activity** | 🟡 Medium | Unclassified but suspicious interactions | `/.env`, `/config.php` |
| 7 | 🔨 **Brute Force** | 🟡 Medium | Rapid credential stuffing / password guessing | `/api/login` (POST) |
| 8 | 🌐 **SSRF** | 🔴 Critical | Server-Side Request Forgery — internal resource access | `/api/internal/proxy` |
| 9 | 📤 **File Upload Attack** | 🟠 High | Malicious file upload (web shells, scripts) | `/upload` (POST) |
| 10 | 📡 **LDAP Injection** | 🔴 Critical | Directory service query manipulation | `/api/ldap/search` (POST) |

### Severity Breakdown
- **🔴 Critical**: SQL Injection, Command Injection, SSRF, LDAP Injection
- **🟠 High**: XSS, Directory Traversal, File Upload Attack
- **🟡 Medium**: Brute Force, Suspicious Activity
- **🟢 Low**: Reconnaissance

---

## ⚙ How It Works

### Attack Flow (End-to-End)

```
1. Attacker visits a trap endpoint (e.g., /login with payload "' OR 1=1 --")
                    │
2. Flask receives the request
                    │
3. ML Model (Random Forest) classifies the payload → "SQL Injection"
   └─ If ML fails → Pattern-based regex detection (fallback)
                    │
4. GeoIP2 looks up attacker's IP → Country, City, Lat/Lon
                    │
5. Attack log saved to SQLite database
                    │
6. SSE pushes notification → Dashboard receives real-time event
                    │
7. Dashboard shows:
   ├─ New threat card with attack details
   ├─ Red alert flash + audio notification
   ├─ Updated analytics charts
   ├─ Attack marker on world map
   └─ Updated severity distribution
```

### ML Classification Pipeline

```
Payload String (e.g., "' OR 1=1 --")
        │
        ▼
  TF-IDF Vectorizer (vectorizer.pkl)
  ├─ Converts text to numerical features
  └─ Character-level n-grams
        │
        ▼
  Random Forest Classifier (classifier.pkl)
  ├─ 97%+ accuracy
  ├─ Trained on WEB_APPLICATION_PAYLOADS dataset
  └─ Multi-class classification
        │
        ▼
  Prediction: "SQL Injection" / "XSS" / "Command Injection" / etc.
```

### Pattern-Based Fallback Detection

If the ML model is not loaded or fails, the system uses regex pattern matching:

| Attack Type | Example Pattern |
|---|---|
| SQL Injection | `' OR 1=1`, `UNION SELECT`, `DROP TABLE` |
| XSS | `<script>`, `javascript:`, `onerror=` |
| Command Injection | `; cat /etc/passwd`, `rm -rf /`, backtick execution |
| Directory Traversal | `../`, `%2e%2e/`, `/etc/passwd` |
| Brute Force | `admin`/`password123`, `password1`, `admin1` |
| SSRF | `http://169.254.169.254`, `file:///`, `@localhost` |
| File Upload | `.php`, `webshell`, `shell.php`, `<?php` |
| LDAP Injection | `*)(&`, `objectClass=*`, `ldap://` |

---

## 🚀 Setup & Installation

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **npm**

### 1. Clone the Repository

```bash
git clone https://github.com/Ghanasree-S/Honeypot-in-a-Box-Computer-Security.git
cd Honeypot-in-a-Box-Computer-Security
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv virt
# Activate (Windows)
virt\Scripts\activate
# Activate (Mac/Linux)
source virt/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# From project root
npm install
```

### 4. Environment Variables

Create `backend/.env`:
```env
DATABASE_URL=sqlite:///database.db
SECRET_KEY=your-secret-key-here
```

For AI Chat, set the Gemini API key as environment variable:
```env
API_KEY=your-google-gemini-api-key
```

---

## ▶ Running the Project

### Start Backend (Terminal 1)
```bash
cd backend
python app.py
```
Backend runs at: **http://localhost:5000**

### Start Frontend (Terminal 2)
```bash
npm run dev
```
Frontend runs at: **http://localhost:5173**

### Quick Start (Windows)
```bash
start.bat
```

---

## 🎮 Attack Simulation

### Option 1: Browser — Open Attack Page Directly
Visit: **http://localhost:5173/attacker.html**

Click any of the 10 attack buttons and watch the dashboard react!

### Option 2: QR Code — Scan from Phone
1. Visit: **http://localhost:5173/qrcode.html**
2. Enter your PC's local IP (e.g., `192.168.1.100`)
3. Generate QR code
4. Scan from phone → opens attack page
5. Tap attack buttons → watch dashboard on laptop react!

> ⚠️ For local mode, phone must be on the same WiFi as laptop.

### Option 3: cURL — Manual API Attacks

```bash
# SQL Injection attack
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"'"'"' OR 1=1 --"}'

# XSS attack
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"<script>alert(1)</script>","password":"test"}'

# SSRF attack
curl -X POST http://localhost:5000/api/internal/proxy \
  -H "Content-Type: application/json" \
  -d '{"url":"http://169.254.169.254/latest/meta-data/"}'

# Access fake config file
curl http://localhost:5000/.env

# Access fake database backup
curl http://localhost:5000/backup
```

---

## 📡 API Endpoints

### Honeypot Trap Endpoints (Fake Vulnerable Pages)

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/login` | Fake login page |
| GET/POST | `/admin` | Fake admin panel |
| GET/POST | `/administrator` | Fake administrator page |
| GET | `/wp-admin` | Fake WordPress admin |
| GET | `/api/admin` | Fake API admin endpoint |
| GET | `/backup` | Fake database backup download |
| GET | `/database.sql` | Fake SQL dump |
| GET | `/.env` | Fake environment config |
| GET | `/config.php` | Fake PHP config |
| POST | `/api/login` | Fake API login (brute force trap) |
| GET/POST | `/api/internal/proxy` | Fake internal proxy (SSRF trap) |
| GET/POST | `/upload` | Fake file upload endpoint |
| GET/POST | `/api/ldap/search` | Fake LDAP directory (injection trap) |
| GET/POST | `/api/directory/lookup` | Fake directory lookup |

### Dashboard API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/threats?limit=50` | Get recent attack logs |
| GET | `/api/stats` | Get analytics data (types, countries, time series) |
| GET | `/api/attack-locations` | Get attacks with geo-coordinates for map |
| GET | `/api/stream` | SSE stream for real-time attack notifications |
| POST | `/api/block-ip` | Block an IP address |
| GET | `/api/blocked-ips` | List blocked IPs |
| POST | `/api/reports/generate` | Generate PDF report |

### Authentication API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/verify` | Verify JWT token |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/change-password` | Change password |

### Email Alert API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/email-alerts/config` | Get alert config |
| POST | `/api/email-alerts/config` | Update alert config |
| POST | `/api/email-alerts/test` | Send test alert |
| GET | `/api/email-alerts/history` | Get alert history |

---

## 🧠 ML Model Details

### Training
```bash
cd backend/scripts
python train_model.py
```

### Dataset
- **Source**: `data/WEB_APPLICATION_PAYLOADS.jsonl` + `data/training_data.csv`
- **Features**: TF-IDF vectorized payload text (character n-grams)
- **Algorithm**: Random Forest Classifier
- **Accuracy**: 97%+ on test set

### Evaluation
```bash
python scripts/evaluate_model.py
```

### Model Files
| File | Size | Description |
|---|---|---|
| `classifier.pkl` | ~1.8 MB | Trained Random Forest model |
| `vectorizer.pkl` | ~100 KB | TF-IDF Vectorizer |

---

## ☁ Deployment

### Render (Cloud Deployment)

The project is deployed on **Render.com**:
- **Backend**: `https://honeypot-in-a-box-computer-security.onrender.com`
- **Frontend**: Deployed via Vite build

The attack simulator and QR code pages auto-detect whether running locally or on cloud and adjust the target URLs accordingly.

---

## 👥 Authors

- **Ghanasree S** — Developer

---

## ⚠️ Disclaimer

> This project is for **EDUCATIONAL AND RESEARCH PURPOSES ONLY**. It is designed for studying cybersecurity concepts in a controlled environment. Do NOT deploy this on unauthorized networks or use it to attack systems you don't own. The honeypot endpoints serve fake data and do not expose real system information.

---

## 📜 License

This project is part of the Semester 6 Computer Security coursework.
