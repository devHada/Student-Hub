import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { professors } from "../data/landingData";

export default function AIAssistant() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const avatar = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "S";

  const professorRoutes = {
    "Prof Sasha": "sasha",
    "Prof Levi": "levi",
    "Prof Zeke": "zeke",
  };

  return (
    <div className="app-screen flex" style={{ background: "var(--bg)" }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-40"
            style={{ background: "#00000066" }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative z-50 lg:z-auto h-full
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-64">
        {/* Navbar */}
        <div
          className="px-4 md:px-8 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
              </svg>
            </button>
            <div>
              <h2
                className="text-lg md:text-xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Professor AI
              </h2>
              <p
                className="text-xs md:text-sm hidden sm:block"
                style={{ color: "var(--text-secondary)" }}
              >
                Choose your learning style. Your professor is waiting.
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/profile")}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold cursor-pointer text-sm flex-shrink-0"
            style={{ background: "var(--primary)", color: "var(--bg)" }}
          >
            {avatar}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start md:justify-center px-4 md:px-8 py-6 md:py-0 gap-6 md:gap-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1
              className="font-bold mb-2 md:mb-3"
              style={{
                color: "var(--text)",
                fontSize: "clamp(24px, 5vw, 48px)",
              }}
            >
              Choose your Professor
            </h1>
            <p
              className="text-sm md:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              Three personalities. One goal — make you actually understand.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center w-full max-w-5xl">
            {professors.map(function (prof, index) {
              return (
                <motion.div
                  key={prof.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  whileHover={{
                    y: -8,
                    boxShadow: `0 20px 60px ${prof.color}35`,
                  }}
                  onClick={() => navigate(`/ai/${professorRoutes[prof.name]}`)}
                  className="cursor-pointer rounded-2xl flex flex-col flex-1"
                  style={{
                    background: "var(--card)",
                    border: `1px solid ${prof.color}44`,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Glow top bar */}
                  <div
                    style={{
                      height: "4px",
                      background: `linear-gradient(90deg, ${prof.color}, ${prof.color}88)`,
                    }}
                  />

                  <div className="p-5 md:p-7 flex flex-col gap-3 md:gap-4 flex-1">
                    {/* Emoji + Name + Vibe */}
                    <div className="flex items-center gap-3 md:gap-4">
                      <div
                        className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0"
                        style={{ background: prof.color + "20" }}
                      >
                        {prof.emoji}
                      </div>
                      <div>
                        <h3
                          className="text-lg md:text-xl font-bold"
                          style={{ color: "var(--text)" }}
                        >
                          {prof.name}
                        </h3>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: prof.color + "22",
                            color: prof.color,
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {prof.vibe}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{ height: "1px", background: "var(--border)" }}
                    />

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "var(--text-secondary)",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {prof.desc}
                    </p>

                    {/* Quote */}
                    <div
                      className="rounded-xl p-3 md:p-4 flex-1 flex items-center"
                      style={{
                        background: prof.color + "10",
                        borderLeft: `3px solid ${prof.color}`,
                      }}
                    >
                      <p
                        className="text-xs md:text-sm italic leading-relaxed"
                        style={{
                          color: prof.color,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {prof.sample}
                      </p>
                    </div>

                    {/* Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-2 md:py-3 rounded-xl font-semibold text-sm"
                      style={{
                        background: `linear-gradient(135deg, ${prof.color}, ${prof.color}cc)`,
                        color: "#fff",
                        fontFamily: "Inter, sans-serif",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Start with {prof.name.split(" ")[1]} →
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* More to come */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3"
          >
            <div
              style={{
                height: "1px",
                width: "40px",
                background: "var(--border)",
              }}
            />
            <p
              className="text-xs md:text-sm"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              ✨ More professors coming soon
            </p>
            <div
              style={{
                height: "1px",
                width: "40px",
                background: "var(--border)",
              }}
            />
          </motion.div>

          <div className="md:hidden h-4" />
        </div>
      </div>
    </div>
  );
}
