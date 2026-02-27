import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Zap, Star } from "lucide-react";
import { getUserProfile } from "../../firebase/users";

export default function MemberBar({ members, leaderId, groupCode }) {
  const [popup, setPopup] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [loadingPopup, setLoadingPopup] = useState(false);

  async function handleAvatarClick(member) {
    if (popup === member.uid) {
      setPopup(null);
      setPopupData(null);
      return;
    }
    setPopup(member.uid);
    setLoadingPopup(true);
    try {
      const profile = await getUserProfile(member.uid);
      setPopupData(profile);
    } catch (e) {
      setPopupData(null);
    } finally {
      setLoadingPopup(false);
    }
  }

  // Sort members by XP for rank (we'll use popupData only when shown)
  const sortedByXP = [...members];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px 24px",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Member circles */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {members.map(function (m, i) {
          return (
            <div key={m.uid} style={{ position: "relative" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1 }}
                onClick={function () {
                  handleAvatarClick(m);
                }}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: m.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  border:
                    popup === m.uid
                      ? "3px solid var(--primary)"
                      : "3px solid transparent",
                }}
                title={m.name}
              >
                {m.avatar}
              </motion.div>
              {m.uid === leaderId && (
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <Crown size={14} fill="#FFD700" color="#FFD700" />
                </div>
              )}

              {/* XP Popup */}
              <AnimatePresence>
                {popup === m.uid && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    style={{
                      position: "absolute",
                      top: "56px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 100,
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "16px",
                      padding: "16px",
                      width: "180px",
                      boxShadow: "0 8px 32px #00000044",
                    }}
                    onClick={function (e) {
                      e.stopPropagation();
                    }}
                  >
                    {/* Close */}
                    <button
                      onClick={function () {
                        setPopup(null);
                        setPopupData(null);
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "none",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      <X size={12} />
                    </button>

                    {/* Avatar */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: m.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        {m.avatar}
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <p
                          style={{
                            color: "var(--text)",
                            fontWeight: "700",
                            fontSize: "14px",
                            fontFamily: "Inter, sans-serif",
                            margin: 0,
                          }}
                        >
                          {m.name}
                        </p>
                        {m.uid === leaderId && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                              marginTop: "2px",
                            }}
                          >
                            <Crown size={10} fill="#FFD700" color="#FFD700" />
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#FFD700",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: "600",
                              }}
                            >
                              Group Leader
                            </span>
                          </div>
                        )}
                      </div>

                      {loadingPopup ? (
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "12px",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          Loading...
                        </p>
                      ) : popupData ? (
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {/* Level */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              background: "var(--bg)",
                              borderRadius: "10px",
                              padding: "8px 12px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Star
                                size={12}
                                style={{ color: "var(--primary)" }}
                              />
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "var(--text-secondary)",
                                  fontFamily: "Inter, sans-serif",
                                }}
                              >
                                Level
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "var(--primary)",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              {popupData.level || 1}
                            </span>
                          </div>

                          {/* XP */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              background: "var(--bg)",
                              borderRadius: "10px",
                              padding: "8px 12px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Zap size={12} style={{ color: "#FFD700" }} />
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "var(--text-secondary)",
                                  fontFamily: "Inter, sans-serif",
                                }}
                              >
                                XP
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#FFD700",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              {popupData.xp || 0}
                            </span>
                          </div>

                          {/* Study Time */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              background: "var(--bg)",
                              borderRadius: "10px",
                              padding: "8px 12px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                color: "var(--text-secondary)",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              ⏱ Study
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                color: "var(--text)",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              {Math.floor((popupData.studyTime || 0) / 60)}m
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "12px",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          No data found
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 6 - members.length) }).map(
          function (_, i) {
            return (
              <div
                key={i}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "2px dashed var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{ color: "var(--text-secondary)", fontSize: "18px" }}
                >
                  +
                </span>
              </div>
            );
          },
        )}
      </div>

      {/* Names bar + code */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            flex: 1,
            background: "var(--primary)",
            borderRadius: "10px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {members.map(function (m, i) {
            return (
              <span
                key={m.uid}
                style={{
                  color: "var(--bg)",
                  fontSize: "13px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "600",
                }}
              >
                {m.name}
                {i < members.length - 1 ? "," : ""}
              </span>
            );
          })}
        </div>
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "8px 14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            CODE
          </span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "var(--primary)",
              letterSpacing: "3px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {groupCode}
          </span>
        </div>
      </div>
    </div>
  );
}
