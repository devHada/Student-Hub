import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

export default function TimerCircle({
  minutes,
  seconds,
  isRunning,
  toggleTimer,
  progress,
}) {
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ position: "relative", width: "300px", height: "300px" }}
    >
      <svg width="300" height="300" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
        />
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "var(--text)",
            fontFamily: "Playfair Display, serif",
            letterSpacing: "-2px",
          }}
        >
          {minutes}:{seconds}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTimer}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "var(--primary)", color: "var(--bg)" }}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
