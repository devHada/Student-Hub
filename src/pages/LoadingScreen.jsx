import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { quotes } from "../data/landingData";

function LoadingScreen() {
  const navigate = useNavigate();
  const [quote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)],
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // progress bar fills in 7 seconds
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 100 / 70;
      });
    }, 100);

    // navigate after 7 seconds
    const timer = setTimeout(
      () => navigate("/dashboard", { replace: true }),
      7000,
    );

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      {/* LOGO */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-2"
        style={{ color: "var(--primary)" }}
      >
        Student Hub
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm mb-16"
        style={{ color: "var(--text-secondary)" }}
      >
        made by invictus
      </motion.p>

      {/* QUOTE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-xl text-center mb-16"
      >
        <p
          className="text-2xl font-serif italic leading-relaxed mb-4"
          style={{ color: "var(--text)" }}
        >
          "{quote.text}"
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          — {quote.author}
        </p>
      </motion.div>

      {/* PROGRESS BAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-64"
      >
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "var(--primary)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--text-secondary)" }}
        >
          Setting up your space...
        </p>
      </motion.div>
    </div>
  );
}

export default LoadingScreen;
