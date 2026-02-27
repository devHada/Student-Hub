import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, LogIn, Loader } from "lucide-react";
import { createGroup, joinGroup } from "../../firebase/groups";
import { useAuth } from "../../context/AuthContext";

export default function JoinCreateGroup({ onJoined }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("create");
  const [groupName, setGroupName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!groupName.trim()) return setError("Enter a group name.");
    setLoading(true);
    setError("");
    try {
      const groupId = await createGroup(user, groupName.trim());
      onJoined(groupId);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!code.trim()) return setError("Enter a group code.");
    setLoading(true);
    setError("");
    try {
      const groupId = await joinGroup(user, code.trim());
      onJoined(groupId);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "40px",
          width: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Icon */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <Users size={28} style={{ color: "var(--bg)" }} />
          </div>
          <h2
            className="text-xl font-bold text-center"
            style={{ color: "var(--text)" }}
          >
            Study Group
          </h2>
          <p
            className="text-sm text-center"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Create a new group or join with a code
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-xl p-1"
          style={{ background: "var(--bg)" }}
        >
          {["create", "join"].map(function (t) {
            return (
              <motion.button
                key={t}
                whileTap={{ scale: 0.97 }}
                onClick={function () {
                  setTab(t);
                  setError("");
                }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize"
                style={{
                  background: tab === t ? "var(--primary)" : "transparent",
                  color: tab === t ? "var(--bg)" : "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {t === "create" ? "Create Group" : "Join Group"}
              </motion.button>
            );
          })}
        </div>

        {/* Inputs */}
        {tab === "create" ? (
          <input
            value={groupName}
            onChange={function (e) {
              setGroupName(e.target.value);
            }}
            onKeyDown={function (e) {
              if (e.key === "Enter") handleCreate();
            }}
            placeholder="Group name e.g. Invictus Squad"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "var(--text)",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              outline: "none",
            }}
          />
        ) : (
          <input
            value={code}
            onChange={function (e) {
              setCode(e.target.value);
            }}
            onKeyDown={function (e) {
              if (e.key === "Enter") handleJoin();
            }}
            placeholder="Enter 6-digit group code"
            maxLength={6}
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "var(--text)",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              outline: "none",
              letterSpacing: "4px",
              textAlign: "center",
            }}
          />
        )}

        {/* Error */}
        {error && (
          <p
            style={{
              color: "#e05c5c",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={tab === "create" ? handleCreate : handleJoin}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
          style={{
            background: "var(--primary)",
            color: "var(--bg)",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Inter, sans-serif",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <Loader size={16} className="animate-spin" />
          ) : tab === "create" ? (
            <>
              <Plus size={16} /> Create Group
            </>
          ) : (
            <>
              <LogIn size={16} /> Join Group
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
