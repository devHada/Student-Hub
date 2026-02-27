import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip } from "lucide-react";
import { sendMessage } from "../../firebase/groups";
import { useAuth } from "../../context/AuthContext";

export default function ChatPanel({ groupId, messages, myColor }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(
    function () {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [messages],
  );

  async function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
    await sendMessage(groupId, user, text, myColor);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput(e) {
    const el = e.target;
    el.style.height = "40px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  useEffect(
    function () {
      if (textareaRef.current && input === "") {
        textareaRef.current.style.height = "40px";
      }
    },
    [input],
  );

  function formatTime(timestamp) {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          scrollbarWidth: "thin",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              opacity: 0.5,
              marginTop: "80px",
            }}
          >
            <span style={{ fontSize: "32px" }}>💬</span>
            <p
              style={{
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
              }}
            >
              No messages yet. Say hi 👋
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map(function (msg) {
            const isMe = msg.uid === user.uid;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  display: "flex",
                  flexDirection: isMe ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: "8px",
                }}
              >
                {/* Avatar — both sides */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: msg.color,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: "20px",
                  }}
                >
                  {msg.avatar}
                </div>

                {/* Bubble + name + time */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                    gap: "4px",
                    maxWidth: "65%",
                  }}
                >
                  {/* Name */}
                  <span
                    style={{
                      fontSize: "11px",
                      color: msg.color,
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "700",
                      paddingLeft: isMe ? "0" : "6px",
                      paddingRight: isMe ? "6px" : "0",
                    }}
                  >
                    {isMe ? "You" : msg.name}
                  </span>

                  {/* Bubble */}
                  <div
                    style={{
                      background: isMe ? myColor : "var(--card)",
                      color: isMe ? "#ffffff" : "var(--text)",
                      borderRadius: isMe
                        ? "20px 20px 6px 20px"
                        : "20px 20px 20px 6px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: "1.5",
                      wordBreak: "break-word",
                      boxShadow: isMe
                        ? `0 4px 12px ${myColor}44`
                        : "0 2px 8px #00000022",
                      border: isMe ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Time */}
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--text-secondary)",
                      fontFamily: "Inter, sans-serif",
                      paddingLeft: isMe ? "0" : "6px",
                      paddingRight: isMe ? "6px" : "0",
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Divider */}
      <div
        style={{ height: "1px", background: "var(--border)", flexShrink: 0 }}
      />

      {/* Input bar */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
          background: "var(--card)",
          flexShrink: 0,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            flexShrink: 0,
            padding: "6px",
            borderRadius: "8px",
            marginBottom: "2px",
          }}
        >
          <Paperclip size={18} />
        </motion.button>

        <div
          style={{
            flex: 1,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "2px 8px",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={function (e) {
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Start chatting..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              padding: "10px 8px",
              color: "var(--text)",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              resize: "none",
              outline: "none",
              height: "40px",
              maxHeight: "120px",
              overflowY: "hidden",
              lineHeight: "1.5",
              scrollbarWidth: "none",
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: input.trim() ? myColor : "var(--border)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.2s",
            boxShadow: input.trim() ? `0 4px 12px ${myColor}66` : "none",
          }}
        >
          <Send
            size={16}
            style={{ color: input.trim() ? "#fff" : "var(--text-secondary)" }}
          />
        </motion.button>
      </div>
    </div>
  );
}
