import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { professors } from "../data/landingData";

export default function AIAssistant() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <div
          className="px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              Professor AI
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Choose your learning style. Your professor is waiting.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer text-sm"
            style={{ background: "var(--primary)", color: "var(--bg)" }}
          >
            {avatar}
          </motion.div>
        </div>

        {/* Content — full height, nothing scrolls */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1
              className="text-5xl font-bold mb-3"
              style={{ color: "var(--text)" }}
            >
              Choose your Professor
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              Three personalities. One goal — make you actually understand.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="flex gap-6 justify-center w-full max-w-5xl">
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

                  <div className="p-7 flex flex-col gap-4 flex-1">
                    {/* Emoji + Name + Vibe */}
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ background: prof.color + "20" }}
                      >
                        {prof.emoji}
                      </div>
                      <div>
                        <h3
                          className="text-xl font-bold"
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

                    {/* Divider */}
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
                      className="rounded-xl p-4 flex-1 flex items-center"
                      style={{
                        background: prof.color + "10",
                        borderLeft: `3px solid ${prof.color}`,
                      }}
                    >
                      <p
                        className="text-sm italic leading-relaxed"
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
                      className="w-full py-3 rounded-xl font-semibold text-sm"
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

          {/* More to come — inline, visible, no scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3"
          >
            <div
              style={{
                height: "1px",
                width: "60px",
                background: "var(--border)",
              }}
            />
            <p
              className="text-sm"
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
                width: "60px",
                background: "var(--border)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
