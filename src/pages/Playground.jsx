import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

function MiniTodos() {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: "Complete Physics assignment",
      done: false,
      priority: "high",
    },
    { id: 2, text: "Read Chapter 7", done: true, priority: "medium" },
    { id: 3, text: "Group study at 6pm", done: false, priority: "low" },
  ]);
  const [input, setInput] = useState("");

  function add() {
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: input.trim(), done: false, priority: "medium" },
    ]);
    setInput("");
  }

  const colors = { high: "#e05c5c", medium: "#ffaa00", low: "#4caf7d" };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task..."
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "var(--bg)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        />
        <button
          onClick={add}
          className="px-4 py-2 rounded-lg text-sm text-white font-bold"
          style={{ background: "var(--primary)" }}
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {todos.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              opacity: t.done ? 0.5 : 1,
              borderLeft: `3px solid ${colors[t.priority]}`,
            }}
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() =>
                setTodos(
                  todos.map((x) =>
                    x.id === t.id ? { ...x, done: !x.done } : x,
                  ),
                )
              }
              style={{ accentColor: "var(--primary)" }}
            />
            <span
              className="text-sm flex-1"
              style={{
                color: "var(--text)",
                textDecoration: t.done ? "line-through" : "none",
              }}
            >
              {t.text}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: colors[t.priority] + "33",
                color: colors[t.priority],
              }}
            >
              {t.priority}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MiniNotes() {
  const [folders, setFolders] = useState(["Physics", "Maths"]);
  const [activeFolder, setActiveFolder] = useState("Physics");
  const [note, setNote] = useState(
    "Newton's laws of motion:\n1. An object at rest stays at rest...\n2. F = ma\n3. Every action has an equal and opposite reaction.",
  );
  const [folderInput, setFolderInput] = useState("");

  return (
    <div className="flex gap-3 h-48">
      <div className="w-32 flex flex-col gap-1">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFolder(f)}
            className="text-xs px-3 py-2 rounded-lg text-left truncate"
            style={{
              background: activeFolder === f ? "var(--primary)" : "var(--bg)",
              color: activeFolder === f ? "white" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            📁 {f}
          </button>
        ))}
        <input
          value={folderInput}
          onChange={(e) => setFolderInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && folderInput.trim()) {
              setFolders([...folders, folderInput.trim()]);
              setActiveFolder(folderInput.trim());
              setFolderInput("");
            }
          }}
          placeholder="+ folder"
          className="px-2 py-1 rounded text-xs outline-none mt-1"
          style={{
            background: "var(--bg)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        />
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="flex-1 p-3 rounded-lg text-sm outline-none resize-none"
        style={{
          background: "var(--bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          fontFamily: "Inter, sans-serif",
          lineHeight: "1.6",
        }}
        placeholder="Start writing your notes..."
      />
    </div>
  );
}

function MiniTimer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [mode, setMode] = useState("work");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 0) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const total = mode === "work" ? 25 * 60 : 5 * 60;
  const progress = ((total - seconds) / total) * 283;
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {["work", "break"].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setRunning(false);
              setSeconds(m === "work" ? 25 * 60 : 5 * 60);
            }}
            className="px-4 py-1 rounded-full text-xs capitalize"
            style={{
              background: mode === m ? "var(--primary)" : "var(--bg)",
              color: mode === m ? "white" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeDasharray="283"
            strokeDashoffset={283 - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--text)", fontFamily: "Inter, sans-serif" }}
          >
            {mins}:{secs}
          </span>
          <span
            className="text-xs capitalize"
            style={{ color: "var(--text-secondary)" }}
          >
            {mode}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setRunning(!running)}
          className="px-6 py-2 rounded-lg text-sm font-bold text-white"
          style={{ background: running ? "#e05c5c" : "var(--primary)" }}
        >
          {running ? "⏸ Pause" : "▶ Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(mode === "work" ? 25 * 60 : 5 * 60);
          }}
          className="px-4 py-2 rounded-lg text-sm"
          style={{
            background: "var(--bg)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function MiniChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Arjun",
      avatar: "A",
      color: "#4a90d9",
      text: "Hey everyone ready for the quiz?",
      time: "10:32",
    },
    {
      id: 2,
      name: "Priya",
      avatar: "P",
      color: "#4caf7d",
      text: "Born ready 💪 let's battle!",
      time: "10:33",
    },
    {
      id: 3,
      name: "Dev",
      avatar: "D",
      color: "#ffaa00",
      text: "Starting the AI Battle now 🔥",
      time: "10:33",
    },
  ]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        name: "You",
        avatar: "Y",
        color: "var(--primary)",
        text: input.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-52">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-end gap-2 ${m.name === "You" ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: m.color }}
            >
              {m.avatar}
            </div>
            <div
              className={`flex flex-col ${m.name === "You" ? "items-end" : "items-start"}`}
            >
              <span
                className="text-xs font-bold mb-1"
                style={{ color: m.color }}
              >
                {m.name}
              </span>
              <div
                className="px-3 py-2 rounded-xl text-sm max-w-xs"
                style={{
                  background: m.name === "You" ? "var(--primary)" : "var(--bg)",
                  color: m.name === "You" ? "white" : "var(--text)",
                  border: m.name === "You" ? "none" : "1px solid var(--border)",
                }}
              >
                {m.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Say something..."
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "var(--bg)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        />
        <button
          onClick={send}
          className="px-4 py-2 rounded-lg text-sm text-white"
          style={{ background: "var(--primary)" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function ProfessorPopup({ onClose }) {
  const navigate = useNavigate();
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const msg =
    "Hey! 👋 You've been exploring the playground for 3 minutes — hope you're having fun! To unlock the real Professor AI, save your progress, join study groups, and battle your friends, you'll need to create a free account. It takes 10 seconds. 🎓";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(msg.slice(0, i + 1));
      i++;
      if (i === msg.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 80 }}
      className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden"
      style={{ background: "var(--card)", border: "2px solid var(--primary)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "var(--primary)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg">
            🎓
          </div>
          <div>
            <p className="font-bold text-sm text-white">Professor</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
              3 min demo complete!
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white text-xl hover:opacity-70"
        >
          ×
        </button>
      </div>
      <div className="px-4 py-4">
        <p
          className="text-sm leading-relaxed min-h-16"
          style={{ color: "var(--text)" }}
        >
          {typed}
          {!done && <span className="animate-pulse">|</span>}
        </p>
      </div>
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-4 space-y-2"
          >
            <button
              onClick={() => navigate("/auth")}
              className="w-full py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: "var(--primary)" }}
            >
              🚀 Create Free Account
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg text-sm"
              style={{
                background: "var(--bg)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              Continue exploring
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const tabs = [
  { id: "todos", label: "✅ Todos", component: <MiniTodos /> },
  { id: "notes", label: "📝 Notes", component: <MiniNotes /> },
  { id: "timer", label: "⏱️ Focus Timer", component: <MiniTimer /> },
  { id: "chat", label: "👥 Group Chat", component: <MiniChat /> },
];

export default function Playground() {
  const navigate = useNavigate();
  const { theme, changeTheme, themes } = useTheme();
  const [activeTab, setActiveTab] = useState("todos");
  const [showProfessor, setShowProfessor] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3 * 60);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setShowProfessor(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  const progressPct = ((3 * 60 - timeLeft) / (3 * 60)) * 100;

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
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
              🎮 Playground
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: timeLeft < 30 ? "#e05c5c22" : "var(--card)",
                color: timeLeft < 30 ? "#e05c5c" : "var(--text-secondary)",
                border: `1px solid ${timeLeft < 30 ? "#e05c5c" : "var(--border)"}`,
              }}
            >
              ⏱ Demo: {mins}:{secs}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="px-2 py-1.5 rounded-lg text-sm"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                🎨
              </button>
              <AnimatePresence>
                {showThemeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-32 rounded-lg shadow-xl overflow-hidden z-50"
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
                        className="w-full text-left px-3 py-2 text-xs capitalize"
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
              className="px-3 py-1.5 text-xs rounded-lg text-white font-bold"
              style={{ background: "var(--primary)" }}
            >
              Login →
            </button>
          </div>
        </div>
        <div className="w-full h-1" style={{ background: "var(--border)" }}>
          <div
            className="h-full"
            style={{
              width: `${progressPct}%`,
              background: "var(--primary)",
              transition: "width 1s linear",
            }}
          />
        </div>
      </header>

      {/* HERO */}
      <div className="pt-20 pb-6 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4"
          style={{
            background: "var(--card)",
            color: "var(--primary)",
            border: "1px solid var(--border)",
          }}
        >
          🎮 Interactive Demo — No login required
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{
            color: "var(--text)",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Try Student Hub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Explore all features below. AI Professor appears in {mins}:{secs} with
          more.
        </motion.p>
      </div>

      {/* TABS */}
      <div className="max-w-3xl mx-auto px-4">
        <div
          className="flex gap-2 mb-6 p-1 rounded-xl overflow-x-auto"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background:
                  activeTab === tab.id ? "var(--primary)" : "transparent",
                color: activeTab === tab.id ? "white" : "var(--text-secondary)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl p-6"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              minHeight: "280px",
            }}
          >
            {tabs.find((t) => t.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>

        {/* LOCKED FEATURES */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {[
            {
              icon: "🤖",
              label: "Professor AI",
              desc: "Full AI chat with personality",
            },
            {
              icon: "⚔️",
              label: "AI Battle",
              desc: "Quiz your entire group live",
            },
            { icon: "📌", label: "Board", desc: "Real-time pin board" },
            {
              icon: "🧰",
              label: "Student Toolkit",
              desc: "50+ curated student tools",
            },
            { icon: "👤", label: "Profile & XP", desc: "Track your progress" },
            {
              icon: "🔥",
              label: "Streaks & Levels",
              desc: "Gamified learning",
            },
          ].map((f) => (
            <motion.div
              key={f.label}
              whileHover={{ y: -2 }}
              className="rounded-xl p-4 relative"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs font-bold" style={{ color: "var(--text)" }}>
                {f.label}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {f.desc}
              </p>
              <span
                className="text-xs mt-2 inline-block px-2 py-0.5 rounded-full"
                style={{ background: "var(--primary)", color: "white" }}
              >
                🔒 Login
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center mb-10"
          style={{ background: "var(--primary)" }}
        >
          <div className="text-4xl mb-3">🎓</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Unlock the Full Experience
          </h3>
          <p
            className="text-sm mb-6"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Free account. Takes 10 seconds. No credit card.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="px-8 py-3 rounded-xl text-sm font-bold"
            style={{ background: "white", color: "var(--primary)" }}
          >
            Create Free Account →
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showProfessor && (
          <ProfessorPopup onClose={() => setShowProfessor(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
