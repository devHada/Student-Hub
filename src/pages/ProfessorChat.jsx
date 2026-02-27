import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { professors } from "../data/landingData";
import { askProfessor, fileToBase64 } from "../firebase/gemini";
import {
  Send,
  Paperclip,
  X,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const professorConfig = {
  sasha: {
    systemPrompt:
      "You are Prof Sasha, a chill and fun AI tutor. Use casual language, slang, and humor. Make the student feel relaxed. Use emojis naturally. Never be formal.",
    greeting:
      "Yooo! 👋 Sasha here, your chill study buddy. What are we tackling today bestie? 😎",
  },
  levi: {
    systemPrompt:
      "You are Prof Levi, a strict but effective AI tutor. Never just give answers. Ask questions back. Challenge the student. Push them to think deeply. Be direct and intense.",
    greeting:
      "I don't waste time. Tell me what you're struggling with and I'll make you work for the answer.",
  },
  zeke: {
    systemPrompt:
      "You are Prof Zeke, a highly knowledgeable and formal AI tutor. Give precise, comprehensive, well-structured answers. No jokes. Pure knowledge. Be encyclopedic.",
    greeting:
      "Good day. I am Prof Zeke. State your question clearly and I will provide you with a precise and complete answer.",
  },
};

export default function ProfessorChat() {
  const { professor } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const prof = professors.find((p) => p.name.toLowerCase().includes(professor));
  const config = professorConfig[professor];

  const [messages, setMessages] = useState([
    { role: "assistant", content: config?.greeting || "Hello!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const bottomRef = useRef(null);
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const avatar = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "S";

  // Reset textarea height when input is cleared after send
  useEffect(
    function () {
      if (input === "" && textareaRef.current) {
        textareaRef.current.style.height = "24px";
        textareaRef.current.style.overflowY = "hidden";
      }
    },
    [input],
  );

  useEffect(
    function () {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [messages],
  );

  function handleScroll() {
    const el = chatRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setShowScrollUp(scrollTop > 100);
    setShowScrollDown(scrollTop < scrollHeight - clientHeight - 100);
  }

  useEffect(function () {
    const el = chatRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    handleScroll();
    return function () {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(
    function () {
      handleScroll();
    },
    [messages],
  );

  function scrollToTop() {
    chatRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setAttachedFile(file);
  }

  function removeFile() {
    setAttachedFile(null);
    fileInputRef.current.value = "";
  }

  async function sendMessage() {
    if ((!input.trim() && !attachedFile) || loading) return;

    const userContent = attachedFile
      ? `${input.trim()} [File: ${attachedFile.name}]`
      : input.trim();

    const newMessages = [...messages, { role: "user", content: userContent }];
    setMessages(newMessages);
    setInput("");
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(true);

    try {
      let fileData = null;
      if (attachedFile) {
        fileData = await fileToBase64(attachedFile);
      }

      const reply = await askProfessor(
        config.systemPrompt,
        newMessages,
        fileData,
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleTextareaInput(e) {
    const el = e.target;
    el.style.height = "24px";
    const newHeight = Math.min(el.scrollHeight, 120);
    el.style.height = newHeight + "px";
    el.style.overflowY = el.scrollHeight > 120 ? "scroll" : "hidden";
  }

  if (!prof || !config) {
    navigate("/ai");
    return null;
  }

  return (
    <div className="app-screen flex" style={{ background: "var(--bg)" }}>
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <div
          className="px-8 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: prof.color + "22" }}
            >
              {prof.emoji}
            </div>
            <div>
              <h2
                className="text-lg font-bold leading-tight"
                style={{ color: "var(--text)" }}
              >
                Professor AI
              </h2>
              <p
                className="text-xs"
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {prof.name} · {prof.vibe}
              </p>
            </div>
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

        {/* Chat area — scrollable */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4"
        >
          {/* Professor Identity Header */}
          <div
            className="flex flex-col items-center justify-center py-8 gap-3 rounded-2xl mb-4"
            style={{
              background: `linear-gradient(180deg, ${prof.color}25 0%, ${prof.color}08 100%)`,
              border: `1px solid ${prof.color}33`,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/ai")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{
                background: prof.color + "20",
                color: prof.color,
                fontFamily: "Inter, sans-serif",
                border: `1px solid ${prof.color}33`,
              }}
            >
              <ArrowLeft size={13} />
              Switch Professor
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
              style={{
                background: prof.color + "30",
                border: `2px solid ${prof.color}66`,
                boxShadow: `0 0 30px ${prof.color}33`,
              }}
            >
              {prof.emoji}
            </motion.div>

            <div className="text-center">
              <h3
                className="text-xl font-bold"
                style={{ color: "var(--text)" }}
              >
                {prof.name}
              </h3>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1"
                style={{
                  background: prof.color + "30",
                  color: prof.color,
                  fontFamily: "Inter, sans-serif",
                  border: `1px solid ${prof.color}44`,
                }}
              >
                {prof.vibe}
              </span>
            </div>
          </div>

          {/* Messages */}
          <AnimatePresence>
            {messages.map(function (msg, index) {
              const isUser = msg.role === "user";
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: "12px",
                  }}
                >
                  {!isUser && (
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: prof.color + "22" }}
                    >
                      {prof.emoji}
                    </div>
                  )}
                  <div
                    className="px-4 py-3 text-sm leading-relaxed"
                    style={{
                      maxWidth: "60%",
                      background: isUser ? prof.color : "var(--card)",
                      color: isUser ? "#fff" : "var(--text)",
                      border: isUser ? "none" : "1px solid var(--border)",
                      fontFamily: "Inter, sans-serif",
                      borderRadius: "16px",
                      borderBottomRightRadius: isUser ? "4px" : "16px",
                      borderBottomLeftRadius: isUser ? "16px" : "4px",
                    }}
                  >
                    {msg.content}
                  </div>
                  {isUser && (
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{
                        background: "var(--primary)",
                        color: "var(--bg)",
                      }}
                    >
                      {avatar}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                gap: "12px",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: prof.color + "22" }}
              >
                {prof.emoji}
              </div>
              <div
                className="px-5 py-4 flex items-center gap-1"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  borderBottomLeftRadius: "4px",
                }}
              >
                {[0, 1, 2].map(function (i) {
                  return (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                      className="w-2 h-2 rounded-full"
                      style={{ background: prof.color }}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Scroll buttons — between chat and input, never overlaps send */}
        <div
          className="flex-shrink-0 flex justify-end gap-2 px-8 py-2"
          style={{ minHeight: "0px" }}
        >
          <AnimatePresence>
            {showScrollUp && (
              <motion.button
                key="up"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: prof.color + "22",
                  color: prof.color,
                  border: `1px solid ${prof.color}44`,
                }}
              >
                <ArrowUp size={14} />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showScrollDown && (
              <motion.button
                key="down"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToBottom}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: prof.color + "22",
                  color: prof.color,
                  border: `1px solid ${prof.color}44`,
                }}
              >
                <ArrowDown size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <div
          className="px-8 pb-4 flex-shrink-0"
          style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}
        >
          {attachedFile && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl w-fit"
              style={{
                background: prof.color + "18",
                border: `1px solid ${prof.color}44`,
              }}
            >
              <Paperclip size={13} style={{ color: prof.color }} />
              <span
                className="text-xs"
                style={{ color: prof.color, fontFamily: "Inter, sans-serif" }}
              >
                {attachedFile.name}
              </span>
              <button onClick={removeFile}>
                <X size={13} style={{ color: prof.color }} />
              </button>
            </motion.div>
          )}

          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3"
            style={{
              background: "var(--card)",
              border: `1px solid ${prof.color}44`,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current.click()}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mb-0.5"
              style={{ background: prof.color + "18", color: prof.color }}
            >
              <Paperclip size={15} />
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.pdf,.txt,.doc,.docx"
            />

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleTextareaInput}
              placeholder={`Ask ${prof.name} anything...`}
              rows={1}
              style={{
                color: "var(--text)",
                fontFamily: "Inter, sans-serif",
                background: "transparent",
                outline: "none",
                border: "none",
                resize: "none",
                flex: 1,
                height: "24px",
                maxHeight: "120px",
                overflowY: "hidden",
                lineHeight: "1",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              disabled={(!input.trim() && !attachedFile) || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5"
              style={{
                background:
                  (input.trim() || attachedFile) && !loading
                    ? prof.color
                    : "var(--border)",
                color: "#fff",
                transition: "background 0.2s ease",
              }}
            >
              <Send size={15} />
            </motion.button>
          </div>

          <p
            className="text-xs text-center mt-2"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
