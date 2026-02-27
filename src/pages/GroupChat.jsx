import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../firebase/users";
import Sidebar from "../components/Sidebar";
import JoinCreateGroup from "../components/group/JoinCreateGroup";
import GroupChatMain from "../components/group/GroupChatMain";

export default function GroupChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groupId, setGroupId] = useState(null);
  const [loading, setLoading] = useState(true);

  const avatar = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "S";

  useEffect(
    function () {
      async function checkGroup() {
        if (!user) return;
        const profile = await getUserProfile(user.uid);
        if (profile?.groupId) {
          setGroupId(profile.groupId);
        }
        setLoading(false);
      }
      checkGroup();
    },
    [user],
  );

  function handleJoined(id) {
    setGroupId(id);
  }

  function handleLeft() {
    setGroupId(null);
  }

  return (
    <div className="app-screen flex" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <div
          className="px-8 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              Study Group
            </h2>
            <p
              className="text-sm"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Chat, collaborate, and battle your squad.
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

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p
              style={{
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Loading...
            </p>
          </div>
        ) : groupId ? (
          <GroupChatMain groupId={groupId} onLeft={handleLeft} />
        ) : (
          <JoinCreateGroup onJoined={handleJoined} />
        )}
      </div>
    </div>
  );
}
