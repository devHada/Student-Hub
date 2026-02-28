import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, X, FileText, Image } from "lucide-react";
import { sendMessage } from "../../firebase/groups";
import { useAuth } from "../../context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ChatPanel({ groupId, messages, myColor }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(
    function () {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [messages],
  );

  async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    e.target.value = "";
  }

  function clearSelectedFile() {
    setSelectedFile(null);
  }

  async function handleSend() {
    if (!input.trim() && !selectedFile) return;

    if (selectedFile) {
      setUploading(true);
      try {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `group-files/${groupId}/${Date.now()}_${selectedFile.name}`,
        );
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const isImage = selectedFile.type.startsWith("image/");
        const fileMessage = isImage
          ? `__IMG__${downloadURL}__NAME__${selectedFile.name}`
          : `__FILE__${downloadURL}__NAME__${selectedFile.name}`;

        await sendMessage(groupId, user, fileMessage, myColor);
        setSelectedFile(null);
      } catch (err) {
        console.error("File upload failed:", err);
      } finally {
        setUploading(false);
      }
    }

    if (input.trim()) {
      const text = input.trim();
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "40px";
      await sendMessage(groupId, user, text, myColor);
    }
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

  function renderMessageContent(msg, isMe) {
    const text = msg.text || "";

    if (text.startsWith("__IMG__")) {
      const url = text.replace("__IMG__", "").split("__NAME__")[0];
      const name = text.split("__NAME__")[1] || "image";
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <img
            src={url}
            alt={name}
            style={{
              maxWidth: "220px",
              maxHeight: "180px",
              borderRadius: "12px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => window.open(url, "_blank")}
          />
          <span style={{ fontSize: "11px", opacity: 0.7 }}>{name}</span>
        </div>
      );
    }

    if (text.startsWith("__FILE__")) {
      const url = text.replace("__FILE__", "").split("__NAME__")[0];
      const name = text.split("__NAME__")[1] || "file";
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: isMe ? "#fff" : "var(--text)",
            textDecoration: "none",
          }}
        >
          <FileText size={16} />
          <span style={{ fontSize: "13px", textDecoration: "underline" }}>
            {name}
          </span>
        </a>
      );
    }

    return text;
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

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                    gap: "4px",
                    maxWidth: "65%",
                  }}
                >
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
                    {renderMessageContent(msg, isMe)}
                  </div>

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

      {/* File preview bar */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              padding: "8px 16px",
              background: "var(--card)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {selectedFile.type.startsWith("image/") ? (
              <Image size={14} style={{ color: myColor }} />
            ) : (
              <FileText size={14} style={{ color: myColor }} />
            )}
            <span
              style={{
                fontSize: "12px",
                color: "var(--text)",
                fontFamily: "Inter, sans-serif",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedFile.name}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={clearSelectedFile}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                padding: "2px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
        />

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current.click()}
          style={{
            background: selectedFile ? myColor + "22" : "none",
            border: "none",
            color: selectedFile ? myColor : "var(--text-secondary)",
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
            placeholder={
              selectedFile ? "Add a caption..." : "Start chatting..."
            }
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
          disabled={uploading}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background:
              (input.trim() || selectedFile) && !uploading
                ? myColor
                : "var(--border)",
            border: "none",
            cursor: uploading ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.2s",
            boxShadow:
              (input.trim() || selectedFile) && !uploading
                ? `0 4px 12px ${myColor}66`
                : "none",
          }}
        >
          {uploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid #ffffff44",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
              }}
            />
          ) : (
            <Send
              size={16}
              style={{
                color:
                  input.trim() || selectedFile
                    ? "#fff"
                    : "var(--text-secondary)",
              }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
