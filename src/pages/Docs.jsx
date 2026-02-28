import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Palette } from "lucide-react";

const sections = [
  {
    id: "what",
    label: "01. What is Student Hub?",
    icon: "🎓",
    content: [
      { type: "tagline", text: "One app. Everything a student needs." },
      {
        type: "para",
        text: "Student Hub is a comprehensive, AI-powered productivity and learning platform built exclusively for students. It is not a note-taking app. It is not a timer app. It is not a chat app. It is all of them — and more — woven together into one seamless, beautiful experience.",
      },
      {
        type: "para",
        text: "A student sitting down to study should not have to think about which app to open. They should not have to switch tabs twenty times in an hour. Student Hub gives you an AI tutor with personality, a focus timer with Zen Mode, a study group with AI battles, notes, todos, and a tools library.",
      },
      {
        type: "quote",
        text: "We did not build another productivity app. We built a study companion.",
      },
      { type: "heading", text: "Who Is It For?" },
      {
        type: "list",
        items: [
          "College students managing assignments, deadlines, and exams",
          "Students who want AI help but not a generic, personality-less chatbot",
          "Study groups who want to collaborate and compete together",
          "Anyone who has ever felt overwhelmed by too many apps and too little focus",
        ],
      },
      {
        type: "chips",
        label: "Built with",
        items: [
          "React",
          "Firebase",
          "Groq AI",
          "Tailwind CSS",
          "Framer Motion",
        ],
      },
    ],
  },
  {
    id: "problem",
    label: "02. The Problem",
    icon: "❗",
    content: [
      { type: "tagline", text: "Tab switching is the enemy of learning." },
      {
        type: "para",
        text: "Ask any college student what their study session looks like. Open WhatsApp to coordinate. Switch to YouTube for a lecture. Open Google Docs for notes. Switch to a Pomodoro app. Open a new tab for a PDF converter. Open another for a quiz. Forget what they were studying. Start again.",
      },
      { type: "heading", text: "The Three Core Problems" },
      {
        type: "problems",
        items: [
          {
            title: "App Fragmentation",
            desc: "The average student uses 6–10 different apps in one study session. Every switch costs 23 minutes of refocus time. Multiply that by 5 switches and half your session is gone.",
          },
          {
            title: "No Accountability or Structure",
            desc: "Studying alone without structure is the fastest path to procrastination. There is no system that holds students accountable or gives them a sense of progress.",
          },
          {
            title: "Passive Learning Leads to Forgetting",
            desc: "Most students study by re-reading notes. Without active recall — actually testing yourself — information does not stick. Students who study for hours can blank out in exams.",
          },
        ],
      },
    ],
  },
  {
    id: "features",
    label: "03. Features",
    icon: "⚡",
    content: [
      {
        type: "features",
        items: [
          {
            icon: "🤖",
            tag: "AI-POWERED",
            title: "Professor AI",
            desc: "Three distinct AI professor personalities — Sasha (casual), Levi (challenging), Zeke (formal). Powered by Groq AI. Supports PDFs, images, and Word documents. Every conversation remembers context.",
          },
          {
            icon: "⏱️",
            tag: "PRODUCTIVITY",
            title: "Focus Timer",
            desc: "Pomodoro-based timer with a circular SVG progress ring. Customisable durations. Automatic breaks with desktop notifications. Zen Mode triggers after 10 seconds of inactivity — fullscreen calm with nature videos.",
          },
          {
            icon: "👥",
            tag: "SOCIAL + COMPETITIVE",
            title: "Study Group + AI Battle",
            desc: "Create groups with a 6-digit code. Real-time Firebase chat. AI Battle: choose a subject, Groq generates 5 MCQs, everyone answers in 15 seconds. Correct answers earn XP. Highest weekly XP earns group leader.",
          },
          {
            icon: "✅",
            tag: "ORGANISATION",
            title: "Todos",
            desc: "Personal task manager. Add tasks in seconds. Priority levels with colour coding. Active and completed tabs. Data saved per user. Works even without login for guest users.",
          },
          {
            icon: "📝",
            tag: "KNOWLEDGE",
            title: "Notes",
            desc: "Folder-based note taking with a rich text editor. Bold, Italic, Underline, and Accent colour formatting. Notes auto-save as you type. Clean, distraction-free writing environment.",
          },
          {
            icon: "📌",
            tag: "REAL-TIME",
            title: "Board",
            desc: "Real-time pin board powered by Firebase Firestore. Add cards with any text — ideas, reminders, important notes. Cards appear instantly. Perfect for quick thoughts during a session.",
          },
          {
            icon: "🧰",
            tag: "TOOLS LIBRARY",
            title: "Student Toolkit",
            desc: "A curated library of essential student tools — PDF converters, grammar checkers, citation generators, unit converters, summarisation tools. One click opens the tool. No searching. No ads.",
          },
          {
            icon: "👤",
            tag: "IN PROGRESS",
            title: "Profile Page",
            desc: "Your personal academic identity. XP progress, study time, streaks, and achievement badges. The gamification layer that ties everything together.",
          },
        ],
      },
    ],
  },
  {
    id: "howto",
    label: "04. How to Use",
    icon: "📖",
    content: [
      {
        type: "howto",
        items: [
          {
            title: "Using Professor AI",
            steps: [
              "Click AI Assistant in the sidebar",
              "Choose your professor — Sasha, Levi, or Zeke",
              "Type your question and press Enter",
              "Attach files using the paperclip icon (PDF, image, doc)",
              "Use Shift + Enter to add a new line without sending",
            ],
          },
          {
            title: "Using the Focus Timer",
            steps: [
              "Click Focus Timer in the sidebar",
              "Press Play inside the circle to start",
              "Go idle for 10 seconds — Zen Mode triggers automatically",
              "Click anywhere on Zen Mode screen to return",
              "Click Settings to adjust work/break duration and Zen theme",
            ],
          },
          {
            title: "Using Study Group",
            steps: [
              "Click Group Chat in the sidebar",
              "Create a group (enter a name) or Join with a 6-digit code",
              "Share your code with friends",
              "Type messages and press Enter — appears instantly for everyone",
              "Click Start AI Battle to begin a quiz competition",
            ],
          },
          {
            title: "Starting an AI Battle",
            steps: [
              "Inside Group Chat, click the green Start AI Battle button",
              "Choose a subject from the list",
              "Wait 3–5 seconds while Groq generates 5 questions",
              "Answer each question before the 15-second timer runs out",
              "See results — scores, XP earned, and new Group Leader",
            ],
          },
          {
            title: "Changing Your Theme",
            steps: [
              "Click the theme selector in the top navigation",
              "Choose from Vintage, Light, Dark, Tide, Supernova, or Cosmos",
              "The entire app changes instantly — preference is saved",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "tech",
    label: "05. Tech Stack",
    icon: "🛠️",
    content: [
      { type: "heading", text: "Architecture Overview" },
      {
        type: "para",
        text: "Student Hub follows a clean, component-based architecture with three main layers.",
      },
      {
        type: "tech",
        items: [
          {
            layer: "Context Layer — The Brain",
            desc: "Three React Contexts sit at the top: AuthContext manages the logged-in user. ThemeContext manages the active theme. TimerContext manages the Focus Timer — which is why the timer keeps running even when you navigate to a different page.",
            color: "#4a90d9",
          },
          {
            layer: "Pages Layer — The Screens",
            desc: "Each route corresponds to a Page component. Pages are kept lean — they only manage screen-level state and render the right components. All heavy logic lives in Firebase utility files or contexts.",
            color: "#4caf7d",
          },
          {
            layer: "Firebase Layer — The Data",
            desc: "All data operations are abstracted into dedicated files. auth.js handles authentication. users.js handles profiles and XP. groups.js handles all group operations. board.js handles the pin board.",
            color: "#e8837a",
          },
        ],
      },
      { type: "heading", text: "Technologies Used" },
      {
        type: "techstack",
        items: [
          { name: "React", desc: "Component-based UI", icon: "⚛️" },
          { name: "Firebase", desc: "Auth, Firestore, real-time", icon: "🔥" },
          {
            name: "Groq AI",
            desc: "LLM for Professor AI & Battles",
            icon: "🤖",
          },
          { name: "Tailwind CSS", desc: "Utility-first styling", icon: "🎨" },
          {
            name: "Framer Motion",
            desc: "Animations & transitions",
            icon: "✨",
          },
          { name: "Vite", desc: "Fast build tool", icon: "⚡" },
        ],
      },
    ],
  },
  {
    id: "vision",
    label: "06. Vision & Impact",
    icon: "🚀",
    content: [
      {
        type: "tagline",
        text: "When the right tools are in the right place, students stop procrastinating and start performing.",
      },
      { type: "heading", text: "Social Impact" },
      {
        type: "impact",
        items: [
          {
            icon: "⏳",
            title: "Less Time Wasted",
            desc: "The average student wastes 15–20 minutes per session switching between apps. Student Hub eliminates all of that. Hundreds of hours saved over an academic year.",
          },
          {
            icon: "🎓",
            title: "AI Tutoring for Every Student",
            desc: "Private tutoring is expensive and inaccessible for most Indian students. Professor AI brings high-quality, personalised tutoring to every student — for free.",
          },
          {
            icon: "🧘",
            title: "Better Mental Wellness",
            desc: "Zen Mode addresses study anxiety. Instead of a guilt spiral, it gently brings students back to a calm state. Nature video backgrounds are scientifically linked to reduced stress.",
          },
          {
            icon: "👫",
            title: "Collaborative Learning",
            desc: "AI Battle turns studying from a lonely activity into a social and competitive one. When learning is fun and social, students do more of it.",
          },
        ],
      },
      { type: "heading", text: "Future Roadmap" },
      {
        type: "para",
        text: "Freemium model — core features free forever. Premium unlocks unlimited AI conversations, advanced analytics, and custom themes. Institution licensing for colleges. API partnerships with college ERP systems. Long-term vision: India's largest student productivity platform.",
      },
      { type: "quote", text: "Shinzou wo Sasageyo. Dedicate your heart." },
    ],
  },
];

export default function Docs() {
  const navigate = useNavigate();
  const { theme, changeTheme, themes } = useTheme();
  const [activeSection, setActiveSection] = useState("what");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const current = sections.find((s) => s.id === activeSection);

  function renderContent(block, i) {
    switch (block.type) {
      case "tagline":
        return (
          <div
            key={i}
            className="rounded-xl px-6 py-4 mb-6"
            style={{
              background: "var(--primary)",
              color: "white",
              fontSize: "18px",
              fontWeight: "700",
              fontFamily: "Playfair Display, serif",
            }}
          >
            "{block.text}"
          </div>
        );
      case "quote":
        return (
          <blockquote
            key={i}
            className="border-l-4 pl-4 my-6 italic text-base"
            style={{
              borderColor: "var(--primary)",
              color: "var(--text-secondary)",
              fontFamily: "Playfair Display, serif",
            }}
          >
            "{block.text}"
          </blockquote>
        );
      case "heading":
        return (
          <h3
            key={i}
            className="text-xl font-bold mt-8 mb-3"
            style={{ color: "var(--text)" }}
          >
            {block.text}
          </h3>
        );
      case "para":
        return (
          <p
            key={i}
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
          >
            {block.text}
          </p>
        );
      case "list":
        return (
          <ul key={i} className="space-y-2 mb-6">
            {block.items.map((item, j) => (
              <li
                key={j}
                className="flex items-start gap-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <span style={{ color: "var(--primary)", marginTop: "2px" }}>
                  ▸
                </span>
                {item}
              </li>
            ))}
          </ul>
        );
      case "chips":
        return (
          <div key={i} className="flex flex-wrap items-center gap-2 mb-6">
            <span
              className="text-xs font-bold"
              style={{ color: "var(--text-secondary)" }}
            >
              {block.label}:
            </span>
            {block.items.map((chip, j) => (
              <span
                key={j}
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "var(--border)", color: "var(--text)" }}
              >
                {chip}
              </span>
            ))}
          </div>
        );
      case "problems":
        return (
          <div key={i} className="space-y-4 mb-6">
            {block.items.map((p, j) => (
              <div
                key={j}
                className="rounded-xl p-5"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="font-bold text-sm mb-1"
                  style={{ color: "var(--primary)" }}
                >
                  Problem {j + 1} — {p.title}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        );
      case "features":
        return (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {block.items.map((f, j) => (
              <motion.div
                key={j}
                whileHover={{ y: -3 }}
                className="rounded-xl p-5 relative"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full"
                  style={{
                    background: "var(--border)",
                    color: "var(--text-secondary)",
                    fontSize: "10px",
                  }}
                >
                  {f.tag}
                </span>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h4 className="font-bold mb-2" style={{ color: "var(--text)" }}>
                  {f.title}
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        );
      case "howto":
        return (
          <div key={i} className="space-y-6">
            {block.items.map((h, j) => (
              <div
                key={j}
                className="rounded-xl p-5"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h4 className="font-bold mb-3" style={{ color: "var(--text)" }}>
                  {h.title}
                </h4>
                <ol className="space-y-2">
                  {h.steps.map((step, k) => (
                    <li key={k} className="flex items-start gap-3 text-sm">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "var(--primary)", color: "white" }}
                      >
                        {k + 1}
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        );
      case "tech":
        return (
          <div key={i} className="space-y-4 mb-6">
            {block.items.map((t, j) => (
              <div
                key={j}
                className="rounded-xl p-5"
                style={{
                  background: "var(--card)",
                  border: `1px solid ${t.color}44`,
                  borderLeft: `4px solid ${t.color}`,
                }}
              >
                <p
                  className="font-bold text-sm mb-1"
                  style={{ color: t.color }}
                >
                  {t.layer}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
                >
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        );
      case "techstack":
        return (
          <div key={i} className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {block.items.map((t, j) => (
              <div
                key={j}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p
                    className="font-bold text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case "impact":
        return (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {block.items.map((item, j) => (
              <div
                key={j}
                className="rounded-xl p-5"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4
                  className="font-bold text-sm mb-1"
                  style={{ color: "var(--text)" }}
                >
                  {item.title}
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* HEADER */}
      <header
        className="fixed top-0 w-full z-50"
        style={{
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-sm font-bold"
              style={{ color: "var(--primary)" }}
            >
              ← Student Hub
            </button>
            <span style={{ color: "var(--border)" }}>|</span>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--text)" }}
            >
              📖 Docs
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                style={{
                  background: "var(--card)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                <Palette size={14} />
                <span className="capitalize hidden md:inline">{theme}</span>
              </button>
              <AnimatePresence>
                {showThemeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-36 rounded-lg shadow-xl overflow-hidden z-50"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {themes.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          changeTheme(t);
                          setShowThemeDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm capitalize"
                        style={{
                          background:
                            theme === t ? "var(--primary)" : "transparent",
                          color: theme === t ? "white" : "var(--text)",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-sm rounded text-white"
              style={{ background: "var(--primary)" }}
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-14 min-h-screen max-w-7xl mx-auto">
        {/* DESKTOP SIDEBAR */}
        <aside
          className="hidden md:block w-64 flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto p-6"
          style={{ borderRight: "1px solid var(--border)" }}
        >
          <p
            className="text-xs font-bold uppercase mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Contents
          </p>
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                style={{
                  background:
                    activeSection === s.id ? "var(--primary)" : "transparent",
                  color:
                    activeSection === s.id ? "white" : "var(--text-secondary)",
                }}
              >
                <span>{s.icon}</span>
                <span className="text-xs">{s.label}</span>
              </button>
            ))}
          </nav>
          <div
            className="mt-8 pt-6"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <button
              onClick={() => navigate("/playground")}
              className="w-full px-3 py-2 rounded-lg text-sm text-white"
              style={{ background: "var(--primary)" }}
            >
              🎮 Try Playground
            </button>
          </div>
        </aside>

        {/* MOBILE BOTTOM TABS */}
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex overflow-x-auto gap-2 p-3"
          style={{
            background: "var(--card)",
            borderTop: "1px solid var(--border)",
          }}
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="flex-shrink-0 px-3 py-2 rounded-lg text-xs"
              style={{
                background:
                  activeSection === s.id ? "var(--primary)" : "var(--bg)",
                color:
                  activeSection === s.id ? "white" : "var(--text-secondary)",
              }}
            >
              {s.icon} {s.id}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="text-4xl">{current.icon}</span>
                <h2
                  className="text-2xl md:text-3xl font-bold"
                  style={{
                    color: "var(--text)",
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {current.label}
                </h2>
              </div>
              {current.content.map((block, i) => renderContent(block, i))}
              <div
                className="flex justify-between mt-12 pt-6"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                {sections.findIndex((s) => s.id === activeSection) > 0 ? (
                  <button
                    onClick={() =>
                      setActiveSection(
                        sections[
                          sections.findIndex((s) => s.id === activeSection) - 1
                        ].id,
                      )
                    }
                    className="text-sm px-4 py-2 rounded-lg"
                    style={{
                      background: "var(--card)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    ← Previous
                  </button>
                ) : (
                  <div />
                )}
                {sections.findIndex((s) => s.id === activeSection) <
                sections.length - 1 ? (
                  <button
                    onClick={() =>
                      setActiveSection(
                        sections[
                          sections.findIndex((s) => s.id === activeSection) + 1
                        ].id,
                      )
                    }
                    className="text-sm px-4 py-2 rounded-lg text-white"
                    style={{ background: "var(--primary)" }}
                  >
                    Next →
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
