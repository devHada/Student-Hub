import { motion } from "framer-motion";
import { RotateCcw, Settings } from "lucide-react";

export default function TimerControls({ onReset, onSettings }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <RotateCcw size={15} /> Reset
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSettings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Settings size={15} /> Settings
        </motion.button>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p
          className="text-xs"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          🌙 Go idle for 10 seconds while timer runs to enter Calm Mode
        </p>
        <p
          className="text-xs"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Select theme from Settings for better experience ✨
        </p>
      </div>
    </div>
  );
}
