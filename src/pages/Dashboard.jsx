import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Palette } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { quotes } from "../data/landingData";
import { getUserProfile } from "../firebase/users";
import { subscribeToBoardItems } from "../firebase/board";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getGreetingEmoji() {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

const GRAPH_DATA = [
  { day: "Mon", height: 65 },
  { day: "Tue", height: 82 },
  { day: "Wed", height: 48 },
  { day: "Thu", height: 91 },
  { day: "Fri", height: 73 },
  { day: "Sat", height: 35 },
  { day: "Sun", height: 57 },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, changeTheme, themes } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [dailyQuote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)],
  );
  const [boardItems, setBoardItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const name = profile?.name || user?.email?.split("@")[0] || "Student";

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((data) => setProfile(data));
    const unsub = subscribeToBoardItems(user.uid, (items) =>
      setBoardItems(items),
    );
    return () => unsub();
  }, [user]);

  const studyTime = profile?.studyTime || 24;
  const streak = profile?.streak || 7;
  const xp = profile?.xp || 340;
  const level = profile?.level || 1;

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* NAVBAR */}
        <div
          className="flex items-center justify-between px-4 md:px-8 py-4 mt-14 md:mt-0"
          style={{
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <h2
              className="text-lg md:text-2xl font-bold"
              style={{ color: "var(--text)" }}
            >
              {getGreeting()}, {name} {getGreetingEmoji()}
            </h2>
            <p
              className="text-xs md:text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Welcome back to your study space
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* THEME SELECTOR */}
            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg text-sm"
                style={{
                  background: "var(--card)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                <Palette size={16} />
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
                        {t === "vintage" && "🏺 "}
                        {t === "dark" && "🌑 "}
                        {t === "light" && "☀️ "}
                        {t === "tide" && "🌊 "}
                        {t === "supernova" && "🚀 "}
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PROFILE AVATAR */}
            <div
              onClick={() => navigate("/profile")}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "var(--primary)", cursor: "pointer" }}
            >
              {name[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          {/* Mobile: single column, Tablet: 2 col, Desktop: 3 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* ACTIVITY GRAPH — full width on mobile, 2/3 on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate("/focus")}
              className="col-span-1 sm:col-span-2 lg:col-span-2 rounded-2xl p-4 md:p-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              <h3 className="font-bold mb-1" style={{ color: "var(--text)" }}>
                📊 Activity Graph
              </h3>
              <p
                className="text-xs mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Your study time this week
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                  height: "100px",
                }}
              >
                {GRAPH_DATA.map((item, i) => (
                  <div
                    key={item.day}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${item.height}%` }}
                        transition={{
                          delay: 0.2 + i * 0.05,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                        style={{
                          width: "100%",
                          background: "var(--primary)",
                          borderRadius: "6px 6px 0 0",
                          opacity: 0.85,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* STREAK */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate("/profile")}
              className="col-span-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                minHeight: "160px",
              }}
            >
              <div className="text-4xl md:text-5xl mb-2">🔥</div>
              <h3
                className="text-3xl md:text-4xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {streak}
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Day Streak
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Keep it going!
              </p>
            </motion.div>

            {/* STUDY TIME */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate("/focus")}
              className="col-span-1 rounded-2xl p-6 flex flex-col justify-center"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                minHeight: "160px",
              }}
            >
              <div className="text-3xl mb-2">⏱️</div>
              <h3
                className="text-2xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {studyTime}h
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Study Time
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                This week
              </p>
            </motion.div>

            {/* XP / LEVEL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate("/profile")}
              className="col-span-1 rounded-2xl p-6 flex flex-col justify-center"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                minHeight: "160px",
              }}
            >
              <div className="text-3xl mb-2">⚡</div>
              <h3
                className="text-2xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {xp}
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Level {level}
              </p>
              <div
                className="w-full h-2 rounded-full mt-3"
                style={{ background: "var(--border)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp % 1000) / 10}%` }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-2 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {xp % 1000} / 1000 XP to next level
              </p>
            </motion.div>

            {/* BOARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => navigate("/board")}
              className="col-span-1 rounded-2xl p-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                minHeight: "160px",
              }}
            >
              <h3 className="font-bold mb-1" style={{ color: "var(--text)" }}>
                📌 Board
              </h3>
              <p
                className="text-xs mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Your pinned items
              </p>
              <div className="space-y-3">
                {boardItems.length === 0 ? (
                  <>
                    {[
                      "Math Chapter 5 Notes",
                      "Physics Lab Report",
                      "History Essay Draft",
                    ].map((t, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg text-sm"
                        style={{
                          background: "var(--bg)",
                          color: "var(--text-secondary)",
                          borderLeft: "3px solid var(--primary)",
                          opacity: 0.6,
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </>
                ) : (
                  boardItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg text-sm"
                      style={{
                        background: "var(--bg)",
                        color: "var(--text)",
                        borderLeft: "3px solid var(--primary)",
                      }}
                    >
                      {item.title}
                    </div>
                  ))
                )}
              </div>
              <p
                className="text-xs text-center mt-4"
                style={{ color: "var(--text-secondary)" }}
              >
                + add more on Board page
              </p>
            </motion.div>

            {/* DAILY QUOTE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="col-span-1 rounded-2xl p-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                minHeight: "160px",
              }}
            >
              <h3 className="font-bold mb-3" style={{ color: "var(--text)" }}>
                💬 Quote of the Day
              </h3>
              <p
                className="text-sm italic leading-relaxed"
                style={{ color: "var(--text)" }}
              >
                "{dailyQuote.text}"
              </p>
              <p
                className="text-xs mt-3"
                style={{ color: "var(--text-secondary)" }}
              >
                — {dailyQuote.author}
              </p>
            </motion.div>

            {/* CHAT WITH AI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={() => navigate("/ai")}
              className="col-span-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
              style={{
                background: "var(--primary)",
                cursor: "pointer",
                minHeight: "160px",
              }}
            >
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-white mb-1">Chat with AI</h3>
              <p
                className="text-xs mb-4"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Prof Sasha, Levi or Zeke
              </p>
              <div
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                Start chatting →
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
