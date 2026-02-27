import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { CALM_THEMES } from "../../data/calmThemes";

export default function SettingsModal({
  workDuration,
  breakDuration,
  calmTheme,
  setCalmTheme,
  onApply,
  onClose,
}) {
  const [work, setWork] = useState(workDuration);
  const [brk, setBrk] = useState(breakDuration);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#00000088",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "32px",
          width: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ color: "var(--text)", margin: 0 }}>Timer Settings</h3>
          <button
            onClick={onClose}
            style={{
              color: "var(--text-secondary)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Work Duration:{" "}
              <strong style={{ color: "var(--text)" }}>{work} min</strong>
            </label>
            <input
              type="range"
              min={5}
              max={60}
              value={work}
              onChange={(e) => setWork(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--primary)",
                marginTop: "8px",
              }}
            />
          </div>
          <div>
            <label
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Break Duration:{" "}
              <strong style={{ color: "var(--text)" }}>{brk} min</strong>
            </label>
            <input
              type="range"
              min={1}
              max={30}
              value={brk}
              onChange={(e) => setBrk(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--primary)",
                marginTop: "8px",
              }}
            />
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p
            style={{
              color: "var(--text)",
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "Inter, sans-serif",
              margin: 0,
            }}
          >
            Calm Mode Theme
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {CALM_THEMES.map(function (t) {
              return (
                <motion.button
                  key={t.id}
                  whileHover={!t.disabled ? { scale: 1.05 } : {}}
                  onClick={function () {
                    if (!t.disabled) setCalmTheme(t);
                  }}
                  title={t.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    background: "none",
                    border: "none",
                    cursor: t.disabled ? "not-allowed" : "pointer",
                    opacity: t.disabled ? 0.3 : 1,
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: t.bg,
                      overflow: "hidden",
                      border:
                        calmTheme.id === t.id
                          ? "3px solid var(--primary)"
                          : "2px solid var(--border)",
                    }}
                  >
                    {t.video && (
                      <video
                        src={t.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--text-secondary)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {t.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onApply(work, brk)}
          style={{
            background: "var(--primary)",
            color: "var(--bg)",
            border: "none",
            borderRadius: "12px",
            padding: "12px",
            fontWeight: "600",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
          }}
        >
          Apply Settings
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
