import { motion } from "framer-motion";
import { CALM_THEMES } from "../../data/calmThemes";

export default function CalmThemeSwitcher({
  calmTheme,
  setCalmTheme,
  textColor,
}) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      style={{
        position: "absolute",
        bottom: "32px",
        zIndex: 3,
        display: "flex",
        gap: "12px",
        alignItems: "center",
      }}
    >
      {CALM_THEMES.filter((t) => !t.disabled).map(function (t) {
        return (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.15 }}
            onClick={function (e) {
              e.stopPropagation();
              setCalmTheme(t);
            }}
            title={t.label}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: t.bg,
              overflow: "hidden",
              padding: 0,
              border:
                calmTheme.id === t.id
                  ? `3px solid ${textColor}`
                  : "2px solid #ffffff33",
              cursor: "pointer",
            }}
          >
            {t.video && (
              <video
                src={t.video}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
