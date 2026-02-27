import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, UserX, Check } from "lucide-react";
import { updateGroupName, kickMember } from "../../firebase/groups";

export default function GroupSettingsModal({ group, groupId, user, onClose }) {
  const [newName, setNewName] = useState(group.name);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [kicking, setKicking] = useState(null);

  const isLeader = group.leaderId === user.uid;

  async function handleSaveName() {
    if (!newName.trim() || newName.trim() === group.name) return;
    setSaving(true);
    await updateGroupName(groupId, newName.trim());
    setSaving(false);
    setSaved(true);
    setTimeout(function () {
      setSaved(false);
    }, 2000);
  }

  async function handleKick(member) {
    if (!window.confirm(`Kick ${member.name} from the group?`)) return;
    setKicking(member.uid);
    await kickMember(groupId, member.uid, group);
    setKicking(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "#00000077",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={function (e) {
          e.stopPropagation();
        }}
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "28px",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              color: "var(--text)",
              margin: 0,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Group Settings
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Group name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Group Name
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={newName}
              onChange={function (e) {
                setNewName(e.target.value);
              }}
              disabled={!isLeader}
              onKeyDown={function (e) {
                if (e.key === "Enter") handleSaveName();
              }}
              style={{
                flex: 1,
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "10px 14px",
                color: "var(--text)",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                outline: "none",
                opacity: isLeader ? 1 : 0.6,
              }}
            />
            {isLeader && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveName}
                style={{
                  background: saved ? "#2ecc71" : "var(--primary)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  color: "var(--bg)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "background 0.2s",
                }}
              >
                {saved ? (
                  <>
                    <Check size={14} /> Saved
                  </>
                ) : saving ? (
                  "..."
                ) : (
                  "Save"
                )}
              </motion.button>
            )}
          </div>
          {!isLeader && (
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Only the group leader can change the name.
            </p>
          )}
        </div>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Members */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Members ({group.members.length}/6)
          </label>
          {group.members.map(function (m) {
            const isThisLeader = m.uid === group.leaderId;
            const isMe = m.uid === user.uid;
            return (
              <div
                key={m.uid}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  background: "var(--bg)",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: m.color,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {m.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--text)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {m.name}{" "}
                    {isMe && (
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          fontWeight: "400",
                          fontSize: "12px",
                        }}
                      >
                        (you)
                      </span>
                    )}
                  </p>
                  {isThisLeader && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Crown size={10} fill="#FFD700" color="#FFD700" />
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#FFD700",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Leader
                      </span>
                    </div>
                  )}
                </div>

                {/* Kick button — only leader sees it, can't kick self or other leaders */}
                {isLeader && !isMe && !isThisLeader && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={function () {
                      handleKick(m);
                    }}
                    disabled={kicking === m.uid}
                    style={{
                      background: "none",
                      border: "1px solid #e05c5c",
                      borderRadius: "8px",
                      padding: "5px 10px",
                      color: "#e05c5c",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <UserX size={12} />
                    {kicking === m.uid ? "..." : "Kick"}
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
