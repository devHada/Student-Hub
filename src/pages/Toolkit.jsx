import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  {
    id: "pdf",
    label: "PDF Tools",
    icon: "📄",
    color: "#e05c5c",
    desc: "Edit, convert, merge and compress PDF files",
    tools: [
      {
        name: "iLovePDF",
        desc: "Merge, split, compress, convert PDFs — all in one",
        url: "https://www.ilovepdf.com",
        tag: "Most Popular",
      },
      {
        name: "Smallpdf",
        desc: "Clean and fast all-in-one PDF toolkit",
        url: "https://smallpdf.com",
        tag: "",
      },
      {
        name: "PDF24",
        desc: "25+ free PDF tools, no sign up needed",
        url: "https://tools.pdf24.org",
        tag: "Free",
      },
      {
        name: "Adobe Acrobat Online",
        desc: "Official Adobe PDF tools online",
        url: "https://acrobat.adobe.com/in/en/online.html",
        tag: "",
      },
    ],
  },
  {
    id: "grammar",
    label: "Grammar Checker",
    icon: "✍️",
    color: "#4caf7d",
    desc: "Fix grammar, spelling and improve your writing quality",
    tools: [
      {
        name: "Grammarly",
        desc: "AI-powered grammar, spelling and style checker",
        url: "https://www.grammarly.com",
        tag: "Best",
      },
      {
        name: "LanguageTool",
        desc: "Free grammar checker supporting 20+ languages",
        url: "https://languagetool.org",
        tag: "Free",
      },
      {
        name: "Hemingway Editor",
        desc: "Makes your writing bold, clear and readable",
        url: "https://hemingwayapp.com",
        tag: "",
      },
      {
        name: "QuillBot Grammar",
        desc: "Quick AI-powered grammar fix",
        url: "https://quillbot.com/grammar-check",
        tag: "",
      },
    ],
  },
  {
    id: "summariser",
    label: "Summariser & Paraphraser",
    icon: "📋",
    color: "#4a90d9",
    desc: "Summarise long texts and paraphrase your writing",
    tools: [
      {
        name: "QuillBot",
        desc: "Best paraphraser and summariser for students",
        url: "https://quillbot.com",
        tag: "Best",
      },
      {
        name: "SMMRY",
        desc: "Paste any article and get a clean summary",
        url: "https://smmry.com",
        tag: "Free",
      },
      {
        name: "Resoomer",
        desc: "Summarise academic texts and articles",
        url: "https://resoomer.com",
        tag: "",
      },
      {
        name: "Paraphraser.io",
        desc: "Fast paraphrasing with multiple writing modes",
        url: "https://www.paraphraser.io",
        tag: "",
      },
    ],
  },
  {
    id: "ai",
    label: "AI Tools",
    icon: "🧠",
    color: "#9b6dce",
    desc: "Best AI tools for research, coding, writing and more",
    tools: [
      {
        name: "Perplexity AI",
        desc: "Research anything with AI + live web sources",
        url: "https://www.perplexity.ai",
        tag: "Research",
      },
      {
        name: "Claude",
        desc: "Best AI for writing, analysis and complex thinking",
        url: "https://claude.ai",
        tag: "Writing",
      },
      {
        name: "GitHub Copilot",
        desc: "AI coding assistant — works inside your editor",
        url: "https://github.com/features/copilot",
        tag: "Coding",
      },
      {
        name: "Phind",
        desc: "AI search engine built for developers and students",
        url: "https://www.phind.com",
        tag: "Coding",
      },
      {
        name: "Consensus",
        desc: "AI that searches peer-reviewed research papers",
        url: "https://consensus.app",
        tag: "Research",
      },
      {
        name: "Gamma",
        desc: "AI that builds presentations and docs instantly",
        url: "https://gamma.app",
        tag: "Presentations",
      },
    ],
  },
  {
    id: "resume",
    label: "Resume Builder",
    icon: "📃",
    color: "#e8837a",
    desc: "Build a professional resume that gets noticed",
    tools: [
      {
        name: "Canva Resume Builder",
        desc: "Beautiful resume templates, easy to customise",
        url: "https://www.canva.com/resumes",
        tag: "Best Design",
      },
      {
        name: "Zety",
        desc: "AI-powered resume builder with expert tips",
        url: "https://zety.com",
        tag: "",
      },
      {
        name: "Resume.io",
        desc: "Clean professional resumes in minutes",
        url: "https://resume.io",
        tag: "",
      },
      {
        name: "Novoresume",
        desc: "ATS-friendly resumes for fresh graduates",
        url: "https://novoresume.com",
        tag: "Students",
      },
    ],
  },
  {
    id: "coming",
    label: "More Coming Soon",
    icon: "🚀",
    color: "#888888",
    desc: "More tool categories being added — stay tuned",
    tools: [
      {
        name: "Citation Generator",
        desc: "APA, MLA, Chicago — auto cite any source",
        url: "",
        tag: "Soon",
      },
      {
        name: "Plagiarism Checker",
        desc: "Check your work before submitting",
        url: "",
        tag: "Soon",
      },
      {
        name: "Unit Converter",
        desc: "Convert units instantly for any subject",
        url: "",
        tag: "Soon",
      },
      {
        name: "Flashcard Maker",
        desc: "Create AI-powered study flashcards",
        url: "",
        tag: "Soon",
      },
    ],
  },
];

export default function Toolkit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const avatar = user?.email?.[0].toUpperCase() || "?";

  function handleOpen(url) {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const filtered = CATEGORIES.filter(function (cat) {
    if (activeCategory !== "all" && cat.id !== activeCategory) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      cat.label.toLowerCase().includes(q) ||
      cat.tools.some(function (t) {
        return (
          t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
        );
      })
    );
  });

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <div
          className="px-8 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--text)", fontFamily: "Inter, sans-serif" }}
            >
              Student Toolkit
            </h2>
            <p
              className="text-sm"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Everything you need. One click away.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={function () {
              navigate("/profile");
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer"
            style={{ background: "var(--primary)", color: "var(--bg)" }}
          >
            {avatar}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "28px 32px",
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div>
              <h1
                style={{
                  color: "var(--text)",
                  fontFamily: "Playfair Display, serif",
                  fontSize: "28px",
                  fontWeight: "700",
                  margin: 0,
                }}
              >
                Everything You Need 🧰
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  marginTop: "8px",
                  maxWidth: "480px",
                  lineHeight: "1.6",
                }}
              >
                Stop wasting time searching the internet for student tools. We
                curated the best ones — PDF editors, grammar checkers, AI tools,
                resume builders and more. Click and go.
              </p>
            </div>
            <div
              style={{
                fontSize: "64px",
                flexShrink: 0,
                opacity: 0.8,
              }}
            >
              🎯
            </div>
          </motion.div>

          {/* Search + Filter */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "24px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Search */}
            <div
              style={{
                flex: 1,
                minWidth: "200px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "10px 16px",
              }}
            >
              <Search
                size={16}
                style={{ color: "var(--text-secondary)", flexShrink: 0 }}
              />
              <input
                value={search}
                onChange={function (e) {
                  setSearch(e.target.value);
                }}
                placeholder="Search tools..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Category filters */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[{ id: "all", label: "All", icon: "✨" }, ...CATEGORIES].map(
                function (cat) {
                  const isActive = activeCategory === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={function () {
                        setActiveCategory(cat.id);
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: isActive
                          ? "2px solid var(--primary)"
                          : "1px solid var(--border)",
                        background: isActive ? "var(--primary)" : "var(--card)",
                        color: isActive ? "var(--bg)" : "var(--text)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: isActive ? "600" : "400",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.15s",
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </motion.button>
                  );
                },
              )}
            </div>
          </div>

          {/* Categories */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            <AnimatePresence>
              {filtered.map(function (cat, ci) {
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: ci * 0.05 }}
                  >
                    {/* Category Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          background: cat.color + "22",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          border: `1px solid ${cat.color}44`,
                        }}
                      >
                        {cat.icon}
                      </div>
                      <div>
                        <h3
                          style={{
                            color: "var(--text)",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: "700",
                            fontSize: "16px",
                            margin: 0,
                          }}
                        >
                          {cat.label}
                        </h3>
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            margin: 0,
                          }}
                        >
                          {cat.desc}
                        </p>
                      </div>
                      <div
                        style={{
                          marginLeft: "auto",
                          width: "4px",
                          height: "28px",
                          borderRadius: "2px",
                          background: cat.color,
                        }}
                      />
                    </div>

                    {/* Tool Cards Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {cat.tools.map(function (tool, ti) {
                        const isComingSoon = !tool.url;
                        return (
                          <motion.div
                            key={ti}
                            whileHover={
                              !isComingSoon ? { scale: 1.02, y: -2 } : {}
                            }
                            whileTap={!isComingSoon ? { scale: 0.98 } : {}}
                            onClick={function () {
                              handleOpen(tool.url);
                            }}
                            style={{
                              background: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: "16px",
                              padding: "18px 20px",
                              cursor: isComingSoon ? "default" : "pointer",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              opacity: isComingSoon ? 0.6 : 1,
                              transition: "box-shadow 0.2s",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            {/* Color accent top bar */}
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "3px",
                                background: cat.color,
                              }}
                            />

                            {/* Tag */}
                            {tool.tag && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "12px",
                                  right: "12px",
                                  background: isComingSoon
                                    ? "var(--border)"
                                    : cat.color + "22",
                                  color: isComingSoon
                                    ? "var(--text-secondary)"
                                    : cat.color,
                                  fontSize: "10px",
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: "700",
                                  padding: "2px 8px",
                                  borderRadius: "20px",
                                  border: `1px solid ${isComingSoon ? "var(--border)" : cat.color + "44"}`,
                                }}
                              >
                                {tool.tag}
                              </div>
                            )}

                            {/* Tool name */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                paddingTop: "4px",
                              }}
                            >
                              <p
                                style={{
                                  color: "var(--text)",
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: "700",
                                  fontSize: "15px",
                                  margin: 0,
                                  flex: 1,
                                }}
                              >
                                {tool.name}
                              </p>
                              {!isComingSoon && (
                                <ExternalLink
                                  size={14}
                                  style={{
                                    color: "var(--text-secondary)",
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                            </div>

                            {/* Tool desc */}
                            <p
                              style={{
                                color: "var(--text-secondary)",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "13px",
                                margin: 0,
                                lineHeight: "1.5",
                              }}
                            >
                              {tool.desc}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bottom note */}
          <div
            style={{
              marginTop: "40px",
              padding: "20px 24px",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "24px" }}>💡</span>
            <div>
              <p
                style={{
                  color: "var(--text)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                More tools to come
              </p>
            </div>
          </div>

          <div style={{ height: "40px" }} />
        </div>
      </div>
    </div>
  );
}
