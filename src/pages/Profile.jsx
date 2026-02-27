import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getUserProfile, updateUserProfile } from "../firebase/users";
import Sidebar from "../components/Sidebar";
import { Check, Pencil, Clock, Zap, Star, Palette } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { theme, changeTheme, themes } = useTheme();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editName, setEditName] = useState("");

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
        <div className="flex-1 ml-64 flex items-center justify-center">
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
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <div
          className="flex items-center justify-between px-8 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Profile & Settings
            </h2>
            <p
              className="text-sm"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Manage your identity and preferences
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer"
            style={{
              background: "var(--primary)",
              color: "var(--bg)",
              fontSize: "16px",
            }}
          >
            {(profile?.name || user?.email)?.[0].toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* PROFILE CARD — full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-3 rounded-2xl p-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Avatar + name display */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--primary)22",
                    border: "3px solid var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "var(--primary)",
                    flexShrink: 0,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {(profile?.name || user?.email)?.[0].toUpperCase()}
                </div>
                <div>
                  <h2
                    style={{
                      color: "var(--text)",
                      fontFamily: "Playfair Display, serif",
                      fontSize: "22px",
                      fontWeight: "700",
                      margin: 0,
                    }}
                  >
                    {profile?.name || editName}
                  </h2>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      margin: "4px 0 8px",
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

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "var(--border)",
                  marginBottom: "24px",
                }}
              />

              {/* Edit Name */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    fontSize: "12px",
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
                <div style={{ display: "flex", gap: "10px" }}>
                  <div
                    style={{
                      flex: 1,
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
                      padding: "10px 20px",
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
                      "Save Changes"
                    )}
                  </motion.button>
                </div>
              </div>

              {/* XP Bar inside card */}
              <div>
                <div
                  style={{
                    height: "1px",
                    background: "var(--border)",
                    marginBottom: "20px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>⚡</span>
                    <span
                      style={{
                        color: "var(--text)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
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
                      fontSize: "12px",
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
              className="col-span-3 rounded-2xl p-6"
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
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
                        padding: "10px 18px",
                        borderRadius: "20px",
                        border: isActive
                          ? "2px solid var(--primary)"
                          : "1px solid var(--border)",
                        background: isActive ? "var(--primary)" : "var(--bg)",
                        color: isActive ? "var(--bg)" : "var(--text)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: isActive ? "700" : "400",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
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
              className="col-span-3 rounded-2xl p-6"
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
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
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
                        padding: "14px 16px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
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
                          fontSize: "13px",
                          fontWeight: "600",
                          margin: 0,
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
              className="col-span-3 rounded-2xl p-6"
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
                  }}
                >
                  Coming in v2
                </div>
              </div>
            </motion.div>
          </div>
          <div style={{ height: "40px" }} />
        </div>
      </div>
    </div>
  );
}
