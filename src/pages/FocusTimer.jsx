import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTimer } from "../context/TimerContext";
import Sidebar from "../components/Sidebar";
import TimerStats from "../components/focustimer/TimerStats";
import TimerCircle from "../components/focustimer/TimerCircle";
import TimerControls from "../components/focustimer/TimerControls";
import SettingsModal from "../components/focustimer/SettingsModal";
import CalmMode from "../components/focustimer/CalmMode";
import { CALM_THEMES } from "../data/calmThemes";

export default function FocusTimer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const timer = useTimer();

  const [showSettings, setShowSettings] = useState(false);
  const [calmMode, setCalmMode] = useState(false);
  const [calmTheme, setCalmTheme] = useState(CALM_THEMES[0]);

  const inactivityRef = useRef(null);

  const avatar = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "S";

  useEffect(
    function () {
      if (timer.isRunning) {
        inactivityRef.current = setTimeout(function () {
          setCalmMode(true);
        }, 10 * 1000);
      } else {
        clearTimeout(inactivityRef.current);
        setCalmMode(false);
      }

      return function () {
        clearTimeout(inactivityRef.current);
      };
    },
    [timer.isRunning],
  );

  function handleApplySettings(newWork, newBreak) {
    timer.applySettings(newWork, newBreak);
    setShowSettings(false);
  }

  if (calmMode) {
    return (
      <CalmMode
        calmTheme={calmTheme}
        setCalmTheme={setCalmTheme}
        minutes={timer.minutes}
        seconds={timer.seconds}
        isBreak={timer.isBreak}
        onExit={() => setCalmMode(false)}
      />
    );
  }

  return (
    <div className="app-screen flex" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <div
          className="px-8 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              Focus Timer
            </h2>
            <p
              className="text-sm"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Stay locked in. Beat distraction.
            </p>
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

        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-8 p-8">
          <TimerStats
            sessionCount={timer.sessionCount}
            totalSeconds={timer.totalSeconds}
            isBreak={timer.isBreak}
          />
          <TimerCircle
            minutes={timer.minutes}
            seconds={timer.seconds}
            isRunning={timer.isRunning}
            toggleTimer={timer.toggleTimer}
            progress={timer.progress}
          />
          <TimerControls
            onReset={timer.resetTimer}
            onSettings={() => setShowSettings(true)}
          />
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            workDuration={timer.workDuration}
            breakDuration={timer.breakDuration}
            calmTheme={calmTheme}
            setCalmTheme={setCalmTheme}
            onApply={handleApplySettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
