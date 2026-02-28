# 🎓 Student Hub

### Your All-in-One AI-Powered Study Platform

> _"We didn't build another productivity app. We built a study companion."_

Built by **Team Invictus** — S.S. Jain Subodh P.G. College, Jaipur
For **Shankara Global Hackathon 2026**

---

## 🚀 Live Demo

🔗 [student-hub-phi.vercel.app](https://student-hub-phi.vercel.app)

---

## 📖 What is Student Hub?

Student Hub is a comprehensive, AI-powered productivity and learning platform built exclusively for students. It eliminates app-switching by bringing everything a student needs — AI tutoring, focus timers, group chat, notes, todos, and more — into one seamless experience.

---

## ✨ Features

| Feature                        | Description                                                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 🤖 **Professor AI**            | AI tutor powered by Groq API with 3 distinct personalities — Sasha (chill), Levi (strict), Zeke (formal). Supports file attachments.   |
| ⏱️ **Focus Timer**             | Pomodoro-based timer with a circular progress ring, Zen Mode (fullscreen calm experience), auto-break, and desktop notifications.      |
| 💬 **Study Group + AI Battle** | Real-time group chat with Firebase. AI Battle generates 5 MCQs on any subject — answer fast, earn XP, climb the leaderboard.           |
| ✅ **Todos**                   | Personal task manager with priority levels, completion tracking, and per-user storage. Works for guests too.                           |
| 📝 **Notes**                   | Folder-based rich text editor with bold, italic, underline, and accent color. Auto-saves as you type.                                  |
| 📌 **Board**                   | Real-time pin board powered by Firebase Firestore. Add and delete cards — synced live for all users.                                   |
| 🛠️ **Everything You Need**     | Curated library of essential student tools — PDF converters, grammar checkers, citation generators, and more. One click, no searching. |
| 👤 **Profile Page**            | _(In Progress)_ XP, level, study streak, total focus time, and achievement badges.                                                     |

---

## 🛠️ Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Frontend     | React + Vite                                            |
| Styling      | Tailwind CSS                                            |
| Animations   | Framer Motion                                           |
| Routing      | React Router DOM                                        |
| Auth         | Firebase Authentication (Email/Password + Google OAuth) |
| Database     | Firebase Firestore                                      |
| File Storage | Firebase Storage                                        |
| AI Engine    | Groq API                                                |
| Icons        | Lucide React                                            |
| Deployment   | Vercel                                                  |

---

## 📁 Project Structure

```
student-hub/
├── public/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   └── ChatPanel.jsx
│   │   ├── timer/
│   │   ├── notes/
│   │   ├── todos/
│   │   └── board/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── TimerContext.jsx
│   ├── firebase/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── groups.js
│   │   ├── board.js
│   │   └── groq.js
│   ├── pages/
│   └── App.jsx
├── .env
├── index.html
└── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- A Firebase project
- A Groq API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/student-hub.git
cd student-hub

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_api_key
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🔐 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) and create a project
2. Enable **Authentication** → Email/Password + Google
3. Enable **Firestore Database**
4. Enable **Storage**
5. Add your deployed domain to **Authentication → Settings → Authorized Domains**
6. Also add your domain to **Google Cloud Console → OAuth 2.0 → Authorized JavaScript Origins**

### Firestore Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /group-files/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🚢 Deployment (Vercel)

Student Hub is deployed on Vercel with automatic builds on every push.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo on [vercel.com](https://vercel.com) for automatic deployments on every push to `main`.

---

## 👥 Team Invictus

| Name                         | Role                  | Contribution                                                                                           |
| ---------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| **Dev Hada** _(Team Leader)_ | The Architect         | Firebase architecture, AI integration, Professor AI, Group Chat, Focus Timer, Dashboard, Landing, Auth |
| **Mohit Singh Khinchi**      | The Builder           | Board, Notes, Todos, Sidebar, UI components                                                            |
| **Arpit Singh Bisht**        | The Designer          | Wireframes, visual identity, UI/UX, PPT design                                                         |
| **Khushboo Saini**           | The Component Builder | Feature functions, app structure, documentation                                                        |
| **Ritika Jain**              | The Stylist           | HTML/CSS/JS, theme designs, project documentation                                                      |
| **Naveen Chaudhary**         | The Explorer          | API research, Everything You Need tools library                                                        |

---

## 🏫 About

**S.S. Jain Subodh P.G. College, Jaipur (Autonomous)**
NAAC A++ Grade | NIRF Ranked 81st in India 2024 | UGC College of Excellence

---

## 📄 License

This project was built for the **Shankara Global Hackathon 2026**. All rights reserved by Team Invictus.

---

<div align="center">
  <strong>"Six students. One vision. Infinite dedication."</strong>
  <br><br>
  <em>Shinzou wo Sasageyo. Dedicate your heart.</em>
  <br><br>
  — Team Invictus
</div>
