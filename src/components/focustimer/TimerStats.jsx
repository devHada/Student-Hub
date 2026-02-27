import { motion } from "framer-motion";

export default function TimerStats({ sessionCount, totalSeconds, isBreak }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-6"
    >
      <div className="text-center">
        <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          {sessionCount}
        </p>
        <p
          className="text-xs"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Sessions
        </p>
      </div>
      <div
        style={{ width: "1px", height: "32px", background: "var(--border)" }}
      />
      <div className="text-center">
        <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          {Math.floor(totalSeconds / 60)}m
        </p>
        <p
          className="text-xs"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Total Focus
        </p>
      </div>
      <div
        style={{ width: "1px", height: "32px", background: "var(--border)" }}
      />
      <div className="text-center">
        <p
          className="text-2xl font-bold"
          style={{ color: isBreak ? "var(--accent)" : "var(--primary)" }}
        >
          {isBreak ? "Break" : "Focus"}
        </p>
        <p
          className="text-xs"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Mode
        </p>
      </div>
    </motion.div>
  );
}
