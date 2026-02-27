import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, Swords } from "lucide-react";
import MemberBar from "./MemberBar";
import ChatPanel from "./ChatPanel";
import GroupSettingsModal from "./GroupSettingsModal";
import AIBattle from "./AIBattle";
import {
  subscribeToGroup,
  subscribeToMessages,
  leaveGroup,
} from "../../firebase/groups";
import { useAuth } from "../../context/AuthContext";

export default function GroupChatMain({ groupId, onLeft }) {
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showBattle, setShowBattle] = useState(false);

  useEffect(
    function () {
      const unsub1 = subscribeToGroup(groupId, setGroup);
      const unsub2 = subscribeToMessages(groupId, setMessages);
      return function () {
        unsub1();
        unsub2();
      };
    },
    [groupId],
  );

  async function handleLeave() {
    if (!group) return;
    if (window.confirm("Leave this group?")) {
      await leaveGroup(user, groupId, group);
      onLeft();
    }
  }

  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p
          style={{
            color: "var(--text-secondary)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Loading group...
        </p>
      </div>
    );
  }

  const myMember = group.members.find(function (m) {
    return m.uid === user.uid;
  });
  const myColor = myMember?.color || "var(--primary)";
  const isLeader = group.leaderId === user.uid;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Member bar */}
      <MemberBar
        members={group.members}
        leaderId={group.leaderId}
        groupCode={group.code}
      />

      {/* Group name + controls row */}
      <div
        style={{
          padding: "8px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "var(--text)",
              fontFamily: "Inter, sans-serif",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            {group.name}
          </p>
          <p
            style={{
              margin: 0,
              color: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
            }}
          >
            {group.members.length} member{group.members.length !== 1 ? "s" : ""}
            {isLeader && " · You are the leader"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={function () {
              setShowSettings(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "6px 14px",
              color: "var(--text)",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <Settings size={14} /> Settings
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLeave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "1px solid #e05c5c",
              borderRadius: "10px",
              padding: "6px 14px",
              color: "#e05c5c",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Leave
          </motion.button>
        </div>
      </div>

      {/* Chat */}
      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "0 24px 16px",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <ChatPanel groupId={groupId} messages={messages} myColor={myColor} />
      </div>

      {/* AI Battle button */}
      <div style={{ padding: "0 24px 20px", flexShrink: 0 }}>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={function () {
            setShowBattle(true);
          }}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #1a7a3a, #2ecc71)",
            border: "none",
            borderRadius: "16px",
            color: "#fff",
            fontWeight: "700",
            fontSize: "16px",
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            letterSpacing: "0.5px",
          }}
        >
          <Swords size={20} /> Start AI Battle
        </motion.button>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <GroupSettingsModal
            group={group}
            groupId={groupId}
            user={user}
            onClose={function () {
              setShowSettings(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* AI Battle */}
      <AnimatePresence>
        {showBattle && (
          <AIBattle
            group={group}
            groupId={groupId}
            onClose={function () {
              setShowBattle(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
