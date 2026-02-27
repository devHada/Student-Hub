import { useEffect, useRef, useState } from "react";
import { updateSharedNotes } from "../../firebase/groups";
import { useAuth } from "../../context/AuthContext";

export default function SharedNotes({ groupId, content }) {
  const { user } = useAuth();
  const [localContent, setLocalContent] = useState(content || "");
  const saveTimer = useRef(null);
  const isTyping = useRef(false);

  // Sync incoming content only when not typing
  useEffect(
    function () {
      if (!isTyping.current) {
        setLocalContent(content || "");
      }
    },
    [content],
  );

  function handleChange(e) {
    const val = e.target.value;
    setLocalContent(val);
    isTyping.current = true;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async function () {
      await updateSharedNotes(groupId, user.uid, val);
      isTyping.current = false;
    }, 1000);
  }

  return (
    <div
      style={{
        width: "260px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        background: "var(--card)",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontWeight: "600",
            fontSize: "13px",
            color: "var(--text)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          📝 Shared Notes
        </span>
        <span
          style={{
            fontSize: "10px",
            color: "var(--text-secondary)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          auto-saves
        </span>
      </div>

      <textarea
        value={localContent}
        onChange={handleChange}
        placeholder="Group notes here... everyone can edit"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          padding: "14px 16px",
          color: "var(--text)",
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          resize: "none",
          outline: "none",
          lineHeight: "1.6",
          scrollbarWidth: "thin",
        }}
      />
    </div>
  );
}
