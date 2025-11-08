# 🧠 Intracranial Aneurysm Detection System (IADS)

> An AI-powered full-stack web application for early detection and management of **intracranial aneurysms**, combining Flask (Python) backend, React frontend, and MongoDB Atlas database.

![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Flask%20%7C%20React%20%7C%20MongoDB%20%7C%20Vite-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Development-yellow?style=for-the-badge)

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Setup Guide](#-setup-guide)
  - [Backend (Flask)](#backend-flask)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
- [Screenshots](#-screenshots)
- [Author](#-author)
- [License](#-license)

---

## 🚀 Overview

**IADS (Intracranial Aneurysm Detection System)** is a secure and intelligent web platform designed to help doctors and researchers analyze MRI scans for early aneurysm detection.  
The system combines **AI-based diagnosis**, **email OTP authentication**, and **a modern, responsive dashboard interface**.

---

## ✨ Features

✅ User registration with OTP email verification  
✅ Secure login (bcrypt password hashing)  
✅ Password reset via OTP email verification  
✅ Upload & manage MRI scans  
✅ Doctor dashboard with reports & visualizations  
✅ Gmail SMTP integration for sending OTPs  
✅ Cloud-hosted MongoDB Atlas backend  
✅ Fully responsive design with TailwindCSS  

---

## 🧰 Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | React (Vite) + Tailwind CSS |
| **Backend** | Flask (Python) |
| **Database** | MongoDB Atlas |
| **Email** | Gmail SMTP (App Password) |
| **Authentication** | OTP verification + hashed passwords |
| **Hosting** | Render (backend) + Vercel (frontend) |

---

## 🏗️ System Architecture

```text
React (Frontend)
   │
   ▼
Flask API (Backend)
   │
   ▼
MongoDB Atlas (Database)
   │
   └── Gmail SMTP → Email OTP Verification
```

---

## 📂 Project Structure

```
iads-project/
│
├── backend/
│   ├── app.py               # Flask app entry
│   ├── auth.py              # Auth routes (register, login, forgot)
│   ├── db.py                # MongoDB connection
│   ├── utils.py             # Password hashing, token, OTP helpers
│   ├── emailer.py           # SMTP email sender
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # (Ignored by git)
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages (Login, Register, etc.)
│   │   ├── components/      # Reusable components (Sidebar, Navbar)
│   │   └── api.js           # Axios API service
│   ├── package.json
│   ├── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Guide

### 🧩 Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside `/backend`:

```bash
MONGO_URI=mongodb+srv://<your-db-user>:<password>@cluster0.mongodb.net/iads
SECRET_KEY=your_flask_secret_key
FRONTEND_ORIGIN=http://127.0.0.1:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=IADS Support <youremail@gmail.com>
```

Then run your Flask backend:
```bash
python app.py
```

Your server runs on → `http://127.0.0.1:5000`

---

### 🎨 Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Access the app → `http://127.0.0.1:5173`

If needed, update API base URL in `src/api.js`:
```js
const API_URL = "http://127.0.0.1:5000";
export default API_URL;
```

---

## 🔐 Environment Variables

| Variable | Description |
|-----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `SECRET_KEY` | Flask token encryption key |
| `FRONTEND_ORIGIN` | React app base URL (for CORS) |
| `SMTP_USER` | Gmail sender address |
| `SMTP_PASS` | Gmail App Password |
| `SMTP_HOST` | SMTP host (smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (587) |
| `SMTP_FROM` | Sender name and email |

---

## ☁️ Deployment Guide

### 🔹 Backend → Render.com

1. Push your code to GitHub.
2. Go to [Render](https://render.com) → **New Web Service**.
3. Connect your GitHub repo.
4. Set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Add environment variables from your `.env`.
6. Deploy → You’ll get a live URL like  
   `https://iads-backend.onrender.com`

---

### 🔹 Frontend → Vercel

1. Push your frontend folder to GitHub.
2. Go to [Vercel.com](https://vercel.com)
3. Click “New Project” → Import your repo.
4. Framework = **Vite**
5. Add:
   ```
   VITE_API_URL=https://iads-backend.onrender.com
   ```
6. Deploy → Your live link will look like:
   ```
   https://iads-frontend.vercel.app
   ```

---



---

## 👨‍💻 Author

**FYP Group**  
AI Engineer & Web Developer  
📧 **rabdinophulpoto@gmail.com**  
🌐 [GitHub Profile](https://github.com/yourusername)

---

## 🪪 License

This project is licensed under the **MIT License** — free to use, modify, and share for educational and research purposes.

---

## 💬 Feedback & Collaboration

If you find any issues 🐞 or have suggestions 💡,  
please open an **issue** or **pull request** on GitHub.

> _“Empowering early diagnosis through Artificial Intelligence.”_ ⚕️✨
