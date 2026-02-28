import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function Particle({ x, y, size, duration, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        y: [-20, -120],
        x: [0, (Math.random() - 0.5) * 60],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--primary)",
        pointerEvents: "none",
        filter: "blur(1px)",
      }}
    />
  );
}

function OrbitDot({ radius, duration, color, size = 6 }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{
        position: "absolute",
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        marginTop: -radius,
        marginLeft: -radius,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          top: 0,
          left: "50%",
          marginLeft: -size / 2,
          marginTop: -size / 2,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </motion.div>
  );
}

function GlitchText({ text }) {
  const [display, setDisplay] = useState(text);
  const chars = "!@#$%^&*<>[]{}|ABCDEFabcdef0123456789";

  useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iterations) return text[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );
      iterations += 1;
      if (iterations > text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{display}</span>;
}

export default function NotFound() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
      });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 40 + Math.random() * 50,
    size: 3 + Math.random() * 5,
    duration: 2.5 + Math.random() * 3,
    delay: Math.random() * 4,
  }));

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono&display=swap');`}</style>

      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--primary)22 0%, transparent 70%)",
          pointerEvents: "none",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <Particle
          key={p.id}
          x={p.x}
          y={p.y}
          size={p.size}
          duration={p.duration}
          delay={p.delay}
        />
      ))}

      {/* Main content — mouse parallax */}
      <motion.div
        animate={{ x: mousePos.x * 0.3, y: mousePos.y * 0.3 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
          padding: "24px",
        }}
      >
        {/* Orbital system */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          style={{
            position: "relative",
            width: 180,
            height: 180,
            marginBottom: "8px",
          }}
        >
          {[70, 86].map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                border: "1px solid var(--primary)",
                opacity: i === 0 ? 0.2 : 0.1,
                top: "50%",
                left: "50%",
                marginTop: -r,
                marginLeft: -r,
              }}
            />
          ))}

          <OrbitDot radius={70} duration={4} color="var(--primary)" size={8} />
          <OrbitDot radius={86} duration={7} color="var(--primary)" size={5} />

          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "52px",
              lineHeight: 1,
            }}
          >
            🛸
          </motion.div>
        </motion.div>

        {/* 404 with bouncing digits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ position: "relative", marginBottom: "4px" }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(100px, 22vw, 180px)",
              fontWeight: "900",
              color: "var(--primary)",
              opacity: 0.06,
              whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            404
          </div>

          <div
            style={{
              fontSize: "clamp(52px, 12vw, 96px)",
              fontWeight: "900",
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--text)",
              letterSpacing: "-2px",
              lineHeight: 1,
              display: "flex",
              gap: "4px",
              alignItems: "center",
            }}
          >
            {["4", "0", "4"].map((digit, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                style={{
                  display: "inline-block",
                  color: i % 2 === 0 ? "var(--primary)" : "var(--text)",
                }}
              >
                {digit}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Glitch code tag */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            color: "var(--primary)",
            background: "var(--primary)11",
            border: "1px solid var(--primary)33",
            borderRadius: "6px",
            padding: "5px 14px",
            marginBottom: "20px",
            letterSpacing: "0.5px",
          }}
        >
          <GlitchText text="ERROR: page_not_found.exe" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{
            color: "var(--text)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "800",
            fontSize: "clamp(20px, 4vw, 30px)",
            margin: "0 0 10px",
            textAlign: "center",
          }}
        >
          You drifted off course
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          style={{
            color: "var(--text-secondary)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(13px, 2vw, 15px)",
            maxWidth: "340px",
            lineHeight: 1.7,
            margin: "0 0 32px",
            textAlign: "center",
          }}
        >
          This page got lost somewhere between the notes and the quizzes. Let's
          bring you back.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: "0 8px 30px var(--primary)55",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "13px 28px",
              borderRadius: "14px",
              background: "var(--primary)",
              color: "var(--bg)",
              border: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "box-shadow 0.2s",
            }}
          >
            🏠 Back to Dashboard
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            style={{
              padding: "13px 24px",
              borderRadius: "14px",
              background: "transparent",
              color: "var(--text)",
              border: "1px solid var(--border)",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            ← Go Back
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: "20px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "10px",
          color: "var(--text-secondary)",
          letterSpacing: "1px",
        }}
      >
        STUDENT HUB · v1.0 · PAGE NOT FOUND
      </motion.div>
    </div>
  );
}
