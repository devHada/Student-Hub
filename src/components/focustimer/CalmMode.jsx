import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalmThemeSwitcher from "./CalmThemeSwitcher";

export default function CalmMode({
  calmTheme,
  setCalmTheme,
  minutes,
  seconds,
  isBreak,
  onExit,
}) {
  const tc = calmTheme.textColor;
  const videoRef = useRef(null);
  const [blinking, setBlinking] = useState(false);

  useEffect(
    function () {
      if (!calmTheme.video) return;
      const interval = setInterval(function () {
        setBlinking(true);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
        setTimeout(function () {
          setBlinking(false);
        }, 1500);
      }, 40 * 1000);
      return function () {
        clearInterval(interval);
      };
    },
    [calmTheme],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onExit}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: calmTheme.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {calmTheme.video && (
        <video
          ref={videoRef}
          src={calmTheme.video}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: 0.6,
          }}
        />
      )}

      <AnimatePresence>
        {blinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#000",
              zIndex: 2,
            }}
          />
        )}
      </AnimatePresence>

      {/* Timer pill top */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: "absolute",
          top: "32px",
          zIndex: 3,
          background: "#00000066",
          backdropFilter: "blur(12px)",
          border: `1px solid ${tc}33`,
          borderRadius: "16px",
          padding: "12px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: tc,
            fontFamily: "Playfair Display, serif",
            letterSpacing: "2px",
          }}
        >
          {minutes}:{seconds}
        </span>
        <span
          style={{
            fontSize: "11px",
            color: tc + "99",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {isBreak ? "Break Time" : "Focus Mode"}
        </span>
      </motion.div>

      {/* Center message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        style={{ zIndex: 3, textAlign: "center" }}
      >
        <p
          style={{
            fontSize: "18px",
            color: tc + "cc",
            fontFamily: "Inter, sans-serif",
            fontStyle: "italic",
          }}
        >
          You're in the zone. Keep going.
        </p>
        <p
          style={{
            fontSize: "12px",
            color: tc + "66",
            fontFamily: "Inter, sans-serif",
            marginTop: "8px",
          }}
        >
          Click anywhere to return
        </p>
      </motion.div>

      <CalmThemeSwitcher
        calmTheme={calmTheme}
        setCalmTheme={setCalmTheme}
        textColor={tc}
      />
    </motion.div>
  );
}
