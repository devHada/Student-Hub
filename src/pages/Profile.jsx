import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getUserProfile, updateUserProfile } from "../firebase/users";
import Sidebar from "../components/Sidebar";
import { Check, Pencil, Star, Palette } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { theme, changeTheme, themes } = useTheme();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editName, setEditName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const xpProgress = xp % 1000;
  const xpPercent = Math.min((xpProgress / 1000) * 100, 100);

  useEffect(
    function () {
      if (user) {
        getUserProfile(user.uid).then(function (data) {
          setProfile(data);
          setEditName(data?.name || user.email.split("@")[0]);
          setLoading(false);
        });
      }
    },
    [user],
  );

  async function handleSave() {
    if (!editName.trim()) return;
    setSaving(true);
    await updateUserProfile(user.uid, { name: editName.trim() });
    setProfile(function (prev) {
      return { ...prev, name: editName.trim() };
    });
    setSaving(false);
    setSaved(true);
    setTimeout(function () {
      setSaved(false);
    }, 2000);
  }

  if (loading) {
    return (
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <p
            style={{
              color: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "#00000066" }}
        />
      )}

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
          className="flex items-center justify-between px-4 md:px-8 py-4 flex-shrink-0"
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
                className="text-lg md:text-2xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Profile & Settings
              </h2>
              <p
                className="text-xs md:text-sm hidden sm:block"
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Manage your identity and preferences
              </p>
            </div>
          </div>
          <div
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold cursor-pointer flex-shrink-0"
            style={{
              background: "var(--primary)",
              color: "var(--bg)",
              fontSize: "15px",
            }}
          >
            {(profile?.name || user?.email)?.[0].toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto">
            {/* PROFILE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-4 md:p-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Avatar + name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "var(--primary)22",
                    border: "3px solid var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "var(--primary)",
                    flexShrink: 0,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {(profile?.name || user?.email)?.[0].toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      color: "var(--text)",
                      fontFamily: "Playfair Display, serif",
                      fontSize: "clamp(16px, 3vw, 22px)",
                      fontWeight: "700",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {profile?.name || editName}
                  </h2>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      margin: "4px 0 8px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.email}
                  </p>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "var(--primary)",
                      color: "var(--bg)",
                      borderRadius: "20px",
                      padding: "3px 12px",
                      fontSize: "12px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "700",
                    }}
                  >
                    <Star size={11} /> Level {level}
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: "1px",
                  background: "var(--border)",
                  marginBottom: "20px",
                }}
              />

              {/* Edit Name */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Display Name
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <div
                    style={{
                      flex: 1,
                      minWidth: "160px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "10px 14px",
                    }}
                  >
                    <Pencil
                      size={14}
                      style={{ color: "var(--text-secondary)", flexShrink: 0 }}
                    />
                    <input
                      value={editName}
                      onChange={function (e) {
                        setEditName(e.target.value);
                      }}
                      onKeyDown={function (e) {
                        if (e.key === "Enter") handleSave();
                      }}
                      placeholder="Your name"
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "var(--text)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    style={{
                      background: saved ? "#2ecc71" : "var(--primary)",
                      border: "none",
                      borderRadius: "12px",
                      padding: "10px 16px",
                      color: "var(--bg)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "background 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {saved ? (
                      <>
                        <Check size={14} /> Saved
                      </>
                    ) : saving ? (
                      "Saving..."
                    ) : (
                      "Save"
                    )}
                  </motion.button>
                </div>
              </div>

              {/* XP Bar */}
              <div>
                <div
                  style={{
                    height: "1px",
                    background: "var(--border)",
                    marginBottom: "16px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>⚡</span>
                    <span
                      style={{
                        color: "var(--text)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {xp} XP — Level {level}
                    </span>
                  </div>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                    }}
                  >
                    {1000 - xpProgress} XP to Level {level + 1}
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: "var(--border)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{
                      height: "100%",
                      background: "var(--primary)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* THEME SETTINGS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-4 md:p-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <Palette size={16} style={{ color: "var(--primary)" }} />
                <h3
                  style={{
                    color: "var(--text)",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "700",
                    fontSize: "15px",
                    margin: 0,
                  }}
                >
                  App Theme
                </h3>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {themes.map(function (t) {
                  const isActive = theme === t;
                  const icons = {
                    vintage: "🏺",
                    dark: "🌑",
                    light: "☀️",
                    tide: "🌊",
                    supernova: "🚀",
                    cosmos: "🌌",
                  };
                  return (
                    <motion.button
                      key={t}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={function () {
                        changeTheme(t);
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: isActive
                          ? "2px solid var(--primary)"
                          : "1px solid var(--border)",
                        background: isActive ? "var(--primary)" : "var(--bg)",
                        color: isActive ? "var(--bg)" : "var(--text)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: isActive ? "700" : "400",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "all 0.15s",
                        textTransform: "capitalize",
                      }}
                    >
                      {icons[t]} {t}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* ACCOUNT INFO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-4 md:p-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                style={{
                  color: "var(--text)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "700",
                  fontSize: "15px",
                  marginBottom: "16px",
                }}
              >
                Account Information
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                {[
                  { label: "Email", value: user?.email },
                  {
                    label: "Member Since",
                    value: profile?.createdAt?.toDate
                      ? profile.createdAt
                          .toDate()
                          .toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                      : "Student Hub Member",
                  },
                  {
                    label: "Account Type",
                    value: "Free Account · Student Hub",
                  },
                ].map(function (item) {
                  return (
                    <div
                      key={item.label}
                      style={{
                        background: "var(--bg)",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "10px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          margin: "0 0 4px",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          color: "var(--text)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: "600",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* BADGES COMING SOON */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-4 md:p-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                opacity: 0.7,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h3
                    style={{
                      color: "var(--text)",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "700",
                      fontSize: "15px",
                      margin: 0,
                    }}
                  >
                    🏆 Badges & Achievements
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    Earn badges for study streaks, XP milestones, and AI Battle
                    wins.
                  </p>
                </div>
                <div
                  style={{
                    background: "var(--primary)22",
                    color: "var(--primary)",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: "700",
                    border: "1px solid var(--primary)44",
                    whiteSpace: "nowrap",
                  }}
                >
                  Coming in v2
                </div>
              </div>
            </motion.div>

            <div style={{ height: "20px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
