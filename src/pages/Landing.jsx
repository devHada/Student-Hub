import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { features, professors, demoStudent } from "../data/landingData";

// HOOK - types each letter of Student Hub one by one
function useLetterAnimation(text, delay = 0.08) {
  return text.split("").map((letter, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * delay, duration: 0.4 }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  ));
}

// HOOK - typing effect for hero subtitle
function useTypingEffect(texts, speed = 80) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplayText(current.slice(0, charIndex + 1));
          if (charIndex + 1 === current.length) {
            setTimeout(() => setDeleting(true), 1500);
          } else {
            setCharIndex((c) => c + 1);
          }
        } else {
          setDisplayText(current.slice(0, charIndex - 1));
          if (charIndex - 1 === 0) {
            setDeleting(false);
            setTextIndex((i) => (i + 1) % texts.length);
            setCharIndex(0);
          } else {
            setCharIndex((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed,
    );
    return () => clearTimeout(timeout);
  }, [charIndex, setCharIndex, deleting, textIndex, texts, speed]);

  return displayText;
}

// COMPONENT - fade in when scrolled to
function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
function ProfessorAI({ onClose }) {
  const [stage, setStage] = useState("logo"); // logo → typing → done
  const [typed, setTyped] = useState("");
  const navigate = useNavigate();

  const fullMessage =
    "Hey! 👋 Explore the Playground to try all features instantly, or visit Docs to learn everything about Student Hub. I'm here to guide you! 🎓";

  // stage 1 - show logo for 1.5 sec then start typing
  useEffect(() => {
    if (stage === "logo") {
      const timer = setTimeout(() => setStage("typing"), 1500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // stage 2 - type the message
  useEffect(() => {
    if (stage !== "typing") return;
    let i = 0;
    setTyped("");
    const interval = setInterval(() => {
      setTyped(fullMessage.slice(0, i + 1));
      i++;
      if (i === fullMessage.length) {
        clearInterval(interval);
        setStage("done");
      }
    }, 30);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <motion.div
      initial={{ y: -120, opacity: 0 }}
      drag
      dragConstraints={{
        top: 0,
        left: -window.innerWidth + 340, // 340 = width of professor box
        right: 0,
        bottom: window.innerHeight - 300, // 300 = approx height of professor box
      }}
      dragElastic={0}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -120, opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
      className="fixed right-8 top-20 z-50 w-80 rounded-2xl shadow-2xl landing overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "var(--primary)" }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg"
          >
            🎓
          </motion.div>
          <div>
            <p className="font-bold text-sm text-white">Professor</p>
            <p className="text-xs" style={{ color: "var(--accent)" }}>
              Your AI Study Guide
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:opacity-70 text-xl"
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div className="px-4 py-4">
        {stage === "logo" ? (
          // show big logo first
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center py-4"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
              style={{ background: "var(--bg-secondary)" }}
            >
              🎓
            </div>
          </motion.div>
        ) : (
          // then show typed message
          <p
            className="text-sm leading-relaxed min-h-[60px]"
            style={{ color: "var(--text)" }}
          >
            {typed}
            {stage === "typing" && <span className="animate-pulse">|</span>}
          </p>
        )}
      </div>

      {/* BUTTONS - show after typing done */}
      <AnimatePresence>
        {stage === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-4 space-y-2"
          >
            <button
              onClick={() => navigate("/playground")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-white transition-all"
              style={{ background: "var(--primary)" }}
            >
              🎮 Go to Playground
            </button>
            <button
              onClick={() => navigate("/docs")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text)",
              }}
            >
              📖 Visit Docs
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
export default function Landing() {
  const navigate = useNavigate();
  const { theme, changeTheme, themes } = useTheme();
  const [showProfessor, setShowProfessor] = useState(false);
  const [professorDismissed, setProfessorDismissed] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const typedText = useTypingEffect([
    "Study Smarter 📚",
    "Focus Better ⏱️",
    "Collaborate Faster 👥",
    "Achieve More 🎯",
  ]);
  const titleLetters = useLetterAnimation("Student Hub");

  // show professor after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowProfessor(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // show professor again after 7 minutes
  useEffect(() => {
    if (professorDismissed) {
      const timer = setTimeout(
        () => {
          setShowProfessor(true);
          setProfessorDismissed(false);
        },
        7 * 60 * 1000,
      );
      return () => clearTimeout(timer);
    }
  }, [professorDismissed]);

  function handleCloseProfessor() {
    setShowProfessor(false);
    setProfessorDismissed(true);
  }

  return (
    <div
      style={{ background: "var(--bg)", color: "var(--text)" }}
      className="min-h-screen font-serif"
    >
      {/* HEADER */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 backdrop-blur-sm"
        style={{
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              Student Hub
            </h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              made by invictus
            </p>
          </div>

          {/* NAV LINKS */}
          <nav className="hidden md:flex gap-8 text-sm">
            {[
              { label: "Docs", path: "/docs" },
              { label: "Playground", path: "/playground" },
            ].map((item, i) => (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                onClick={() => navigate(item.path)}
                style={{ color: "var(--text-secondary)" }}
                className="hover:opacity-80 transition-opacity"
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* RIGHT SIDE - theme + login */}
          <div className="flex items-center gap-4">
            {/* THEME DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text)",
                }}
              >
                <Palette size={16} />
                <span className="capitalize">{theme}</span>
              </button>

              <AnimatePresence>
                {showThemeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-36 rounded-lg shadow-xl overflow-hidden z-50"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {themes.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          changeTheme(t);
                          setShowThemeDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm capitalize transition-all"
                        style={{
                          background:
                            theme === t ? "var(--primary)" : "transparent",
                          color: theme === t ? "white" : "var(--text)",
                        }}
                      >
                        {t === "vintage" && "🏺 "}
                        {t === "dark" && "🌑 "}
                        {t === "light" && "☀️ "}
                        {t === "tide" && "🌊 "}
                        {t === "supernova" && "🚀 "}
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* LOGIN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-sm rounded transition-all"
              style={{ background: "var(--primary)", color: "white" }}
            >
              Login
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="px-6 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm uppercase tracking-widest mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Your All-in-One Study Platform
          </motion.p>

          {/* LETTER BY LETTER TITLE */}
          <h2
            className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
            style={{ color: "var(--text)" }}
          >
            {titleLetters}
          </h2>

          {/* SCROLLING TEXT */}
          <div className="overflow-hidden h-10 mb-8">
            <motion.div
              animate={{
                y: [
                  "0%",
                  "-20%",
                  "-20%",
                  "-40%",
                  "-40%",
                  "-60%",
                  "-60%",
                  "-80%",
                  "-80%",
                  ,
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 0.9, 0.95, 1],
              }}
              className="flex flex-col items-center"
            >
              {[
                "Focus Better ⏱️",
                "Study Smarter 📚",
                "No Switching Tabs 🚫",
                "Achieve More 🎯",

                "Focus Better ⏱️",
              ].map((text, i) => (
                <div
                  key={i}
                  className="h-10 flex items-center justify-center text-2xl font-medium"
                  style={{ color: "var(--primary)" }}
                >
                  {text}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Everything you need to study smarter — todos, notes, AI assistant,
            focus timer, and more. All in one place.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth")}
            className="px-8 py-4 text-white text-lg rounded transition-all"
            style={{ background: "var(--primary)" }}
          >
            Get Started Free →
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="mt-6 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Built for students, by students 🎓
          </motion.p>
        </div>
      </section>
      {/* PROFESSOR AI */}
      <AnimatePresence>
        {showProfessor && <ProfessorAI onClose={handleCloseProfessor} />}
      </AnimatePresence>

      {/* REST OF SECTIONS COMING IN PART 5 */}

      {/* MIDDLE 1 - FEATURES */}
      <section className="pt-5 pb-25 px-6 max-w-7xl mx-auto">
        <FadeInSection>
          <h3
            className="text-5xl font-bold text-center mb-4"
            style={{ color: "var(--text)" }}
          >
            Everything You Need
          </h3>
          <p
            className="text-center mb-16 text-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            Stop switching tabs. Start focusing.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <FadeInSection key={f.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                className="rounded-xl p-6 relative"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {f.needsLogin && (
                  <span
                    className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    Login
                  </span>
                )}
                <div className="text-4xl mb-4">{f.icon}</div>
                <h4
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {f.title}
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>
      {/* MIDDLE 2 - GAMIFICATION + DEMO CARD */}
      <section
        className="py-24 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <FadeInSection>
            <h3
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--text)" }}
            >
              Level Up Your Learning 🎮
            </h3>
            <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
              Study hard, earn XP, climb the leaderboard
            </p>
            <div className="space-y-6">
              {[
                {
                  icon: "⚡",
                  title: "Earn XP",
                  desc: "Get points for every task, note and session you complete.",
                },
                {
                  icon: "⚔️",
                  title: "AI Battles",
                  desc: "Challenge your group to AI quizzes and compete for the top.",
                },
                {
                  icon: "👑",
                  title: "Lead Your Team",
                  desc: "Highest XP earns the crown. Your team can vote to dethrone you.",
                },
              ].map((g, i) => (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <span className="text-3xl">{g.icon}</span>
                  <div>
                    <h4
                      className="font-bold mb-1"
                      style={{ color: "var(--text)" }}
                    >
                      {g.title}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {g.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInSection>

          {/* RIGHT - tilted demo card */}
          <FadeInSection delay={0.2}>
            <motion.div
              initial={{ rotate: -6 }}
              whileHover={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="rounded-2xl p-8 shadow-2xl cursor-pointer"
              style={{
                background: "var(--card)",
                border: "2px solid var(--primary)",
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: "var(--primary)" }}
                >
                  {demoStudent.avatar}
                </div>
                <div>
                  <h4
                    className="text-xl font-bold"
                    style={{ color: "var(--text)" }}
                  >
                    {demoStudent.name}
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Level {demoStudent.level}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "XP Earned", value: demoStudent.xp },
                  {
                    label: "Day Streak 🔥",
                    value: `${demoStudent.streak} days`,
                  },
                  { label: "Study Time", value: demoStudent.studyTime },
                  { label: "Level", value: `#${demoStudent.level}` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-4"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <p
                      className="text-xs mb-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {stat.label}
                    </p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </FadeInSection>
        </div>
      </section>
      {/* MIDDLE 3 - PROFESSORS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <FadeInSection>
          <h3
            className="text-3xl font-bold text-center mb-4"
            style={{ color: "var(--text)" }}
          >
            Meet Your Professors 🎓
          </h3>
          <p
            className="text-center mb-16"
            style={{ color: "var(--text-secondary)" }}
          >
            Same knowledge, three completely different teaching styles
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {professors.map((prof, i) => (
            <FadeInSection key={prof.name} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-2xl p-8 text-center"
                style={{
                  background: "var(--card)",
                  border: `2px solid ${prof.color}`,
                }}
              >
                <div className="text-5xl mb-4">{prof.emoji}</div>
                <h4
                  className="text-xl font-bold mb-1"
                  style={{ color: "var(--text)" }}
                >
                  {prof.name}
                </h4>
                <span
                  className="text-xs px-3 py-1 rounded-full inline-block mb-4"
                  style={{ background: prof.color, color: "white" }}
                >
                  {prof.vibe}
                </span>
                <p
                  className="text-sm mb-4 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {prof.desc}
                </p>
                <p className="text-sm italic" style={{ color: prof.color }}>
                  {prof.sample}
                </p>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>
      {/* MIDDLE 4 - CTA */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: "var(--sidebar)" }}
      >
        <FadeInSection>
          <h3 className="text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Studies?
          </h3>
          <p className="mb-10" style={{ color: "var(--accent)" }}>
            Join thousands of students already using Student Hub
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth")}
            className="px-10 py-4 text-white text-lg rounded transition-all"
            style={{ background: "var(--primary)" }}
          >
            Join Now →
          </motion.button>
        </FadeInSection>
      </section>

      {/* MOBILE ONLY - Docs + Playground */}
      <div
        className="md:hidden py-8 px-6 text-center space-y-4"
        style={{
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
          Explore More
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={() => navigate("/docs")}
            className="text-sm px-6 py-3 rounded-lg"
            style={{ background: "var(--primary)", color: "white" }}
          >
            📖 Docs
          </button>
          <button
            onClick={() => navigate("/playground")}
            className="text-sm px-6 py-3 rounded-lg"
            style={{
              background: "var(--bg)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            🎮 Playground
          </button>
        </div>
      </div>
      {/* FOOTER */}
      <footer
        className="py-12 px-6 text-center"
        style={{
          background: "var(--sidebar)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--accent)" }}
        >
          Student Hub
        </h2>
        <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
          Built for the future of education
        </p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          © 2026 Student Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
