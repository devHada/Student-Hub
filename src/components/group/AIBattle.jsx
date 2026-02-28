import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Swords, Trophy, X, Loader, Crown, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { saveBattleResult } from "../../firebase/groups";
import { sendMessage } from "../../firebase/groups";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Computer Science",
  "English Literature",
  "Economics",
  "General Knowledge",
];

export default function AIBattle({ group, groupId, onClose }) {
  const { user } = useAuth();
  const [phase, setPhase] = useState("select");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({});
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [results, setResults] = useState(null);

  const scoresRef = useRef({});

  function updateScores(uid) {
    const updated = {
      ...scoresRef.current,
      [uid]: (scoresRef.current[uid] || 0) + 1,
    };
    scoresRef.current = updated;
    setScores(updated);
  }

  useEffect(
    function () {
      if (phase !== "battle") return;
      if (showAnswer) return;
      setTimeLeft(15);
      const interval = setInterval(function () {
        setTimeLeft(function (prev) {
          if (prev <= 1) {
            clearInterval(interval);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return function () {
        clearInterval(interval);
      };
    },
    [currentQ, phase, showAnswer],
  );

  function handleTimeout() {
    setShowAnswer(true);
    setTimeout(function () {
      nextQuestion();
    }, 2000);
  }

  async function generateQuestions(subj) {
    setPhase("loading");
    // Send battle announcement to group chat
    await sendMessage(
      groupId,
      { uid: "system", displayName: "⚔️ AI Battle", email: "battle@system" },
      `⚔️ AI Battle has started! Subject: ${subj} — Answer fast, highest weekly XP earns group leader!`,
      "#2ecc71",
    );

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "user",
                content: `Generate exactly 5 multiple choice quiz questions about ${subj}. Return ONLY a valid JSON array with no markdown, no code blocks, no explanation. Format exactly like this: [{"question":"...","options":["A","B","C","D"],"correct":0}] where correct is the index 0-3 of the correct option.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 1500,
          }),
        },
      );

      const data = await response.json();
      console.log("Groq response:", JSON.stringify(data));

      const text = data.choices[0].message.content;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQuestions(parsed);

      const initScores = {};
      group.members.forEach(function (m) {
        initScores[m.uid] = 0;
      });
      scoresRef.current = initScores;
      setScores(initScores);

      setPhase("battle");
      setCurrentQ(0);
    } catch (e) {
      console.error("Battle error", e);
      setPhase("select");
      alert("Failed to generate questions. Please try again.");
    }
  }

  function handleAnswer(optionIndex) {
    if (selected !== null || showAnswer) return;
    setSelected(optionIndex);
    setShowAnswer(true);

    const isCorrect = optionIndex === questions[currentQ].correct;
    if (isCorrect) {
      updateScores(user.uid);
    }

    setTimeout(function () {
      nextQuestion();
    }, 1500);
  }

  function nextQuestion() {
    setSelected(null);
    setShowAnswer(false);
    if (currentQ + 1 >= questions.length) {
      endBattle();
    } else {
      setCurrentQ(function (prev) {
        return prev + 1;
      });
    }
  }

  async function endBattle() {
    setPhase("results");
    const finalScores = scoresRef.current;
    const sorted = Object.entries(finalScores).sort(function (a, b) {
      return b[1] - a[1];
    });
    const res = { scores: finalScores, sorted };
    setResults(res);
    // Pass group so saveBattleResult can compare weeklyXP across all members
    await saveBattleResult(groupId, finalScores, group);
  }

  function getMemberByUid(uid) {
    return (
      group.members.find(function (m) {
        return m.uid === uid;
      }) || { name: "Unknown", avatar: "?", color: "#666" }
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000cc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "28px",
          padding: "32px",
          width: "540px",
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {phase !== "battle" && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* PHASE: SELECT */}
        {phase === "select" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #1a7a3a, #2ecc71)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <Swords size={24} color="#fff" />
              </div>
              <h3
                style={{
                  color: "var(--text)",
                  margin: 0,
                  fontFamily: "Playfair Display, serif",
                  fontSize: "22px",
                }}
              >
                AI Battle
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  marginTop: "6px",
                }}
              >
                5 questions. 15 seconds each. Weekly top XP earner becomes
                leader.
              </p>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                Choose Subject
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SUBJECTS.map(function (s) {
                  return (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={function () {
                        setSubject(s);
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border:
                          subject === s
                            ? "2px solid var(--primary)"
                            : "1px solid var(--border)",
                        background:
                          subject === s ? "var(--primary)" : "var(--bg)",
                        color: subject === s ? "var(--bg)" : "var(--text)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        cursor: "pointer",
                        fontWeight: subject === s ? "600" : "400",
                        transition: "all 0.15s",
                      }}
                    >
                      {s}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={function () {
                if (subject) generateQuestions(subject);
              }}
              disabled={!subject}
              style={{
                padding: "14px",
                background: subject
                  ? "linear-gradient(135deg, #1a7a3a, #2ecc71)"
                  : "var(--border)",
                border: "none",
                borderRadius: "14px",
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: "700",
                cursor: subject ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Swords size={18} /> Start Battle
            </motion.button>
          </div>
        )}

        {/* PHASE: LOADING */}
        {phase === "loading" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              padding: "40px 0",
            }}
          >
            <Loader
              size={36}
              className="animate-spin"
              style={{ color: "var(--primary)" }}
            />
            <p
              style={{
                color: "var(--text)",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
              }}
            >
              Groq AI is generating questions...
            </p>
            <p
              style={{
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
              }}
            >
              Subject: {subject}
            </p>
          </div>
        )}

        {/* PHASE: BATTLE */}
        {phase === "battle" && questions[currentQ] && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Question {currentQ + 1} of {questions.length}
              </span>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: timeLeft <= 5 ? "#e05c5c" : "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  transition: "background 0.3s",
                }}
              >
                {timeLeft}
              </div>
            </div>

            <div
              style={{
                height: "4px",
                background: "var(--border)",
                borderRadius: "2px",
              }}
            >
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / 15) * 100}%` }}
                style={{
                  height: "100%",
                  borderRadius: "2px",
                  background: timeLeft <= 5 ? "#e05c5c" : "var(--primary)",
                  transition: "background 0.3s",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {group.members.map(function (m) {
                return (
                  <div
                    key={m.uid}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "var(--bg)",
                      borderRadius: "20px",
                      padding: "4px 10px",
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: m.color,
                        fontSize: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {m.avatar}
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text)",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {scores[m.uid] || 0}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                background: "var(--bg)",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  color: "var(--text)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                {questions[currentQ].question}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {questions[currentQ].options.map(function (opt, i) {
                const isCorrect = i === questions[currentQ].correct;
                const isSelected = i === selected;

                let bg = "var(--bg)";
                let border = "1px solid var(--border)";
                let color = "var(--text)";

                if (showAnswer) {
                  if (isCorrect) {
                    bg = "#1a7a3a";
                    border = "1px solid #2ecc71";
                    color = "#fff";
                  } else if (isSelected && !isCorrect) {
                    bg = "#7a1a1a";
                    border = "1px solid #e05c5c";
                    color = "#fff";
                  }
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!showAnswer ? { scale: 1.02 } : {}}
                    whileTap={!showAnswer ? { scale: 0.98 } : {}}
                    onClick={function () {
                      handleAnswer(i);
                    }}
                    disabled={showAnswer}
                    style={{
                      padding: "14px 18px",
                      background: bg,
                      border,
                      borderRadius: "12px",
                      color,
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      textAlign: "left",
                      cursor: showAnswer ? "default" : "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background:
                          showAnswer && isCorrect ? "#2ecc71" : "var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        flexShrink: 0,
                        color:
                          showAnswer && isCorrect
                            ? "#fff"
                            : "var(--text-secondary)",
                      }}
                    >
                      {["A", "B", "C", "D"][i]}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE: RESULTS */}
        {phase === "results" && results && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <Trophy size={48} style={{ color: "#FFD700" }} />
            <h3
              style={{
                color: "var(--text)",
                margin: 0,
                fontFamily: "Playfair Display, serif",
                fontSize: "24px",
              }}
            >
              Battle Over!
            </h3>

            <div
              style={{
                background: "#1a1a2e",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "14px 20px",
                width: "100%",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                }}
              >
                🏆 Group leader is now determined by{" "}
                <span style={{ color: "#FFD700", fontWeight: "600" }}>
                  weekly XP
                </span>
                . Earn the most XP this week to lead the group!
              </p>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {results.sorted.map(function (entry, i) {
                const member = getMemberByUid(entry[0]);
                const score = entry[1];
                const xpEarned = score * 20;
                return (
                  <div
                    key={entry[0]}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "var(--bg)",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      border:
                        i === 0
                          ? "1px solid #FFD700"
                          : "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        fontWeight: "700",
                        color: i === 0 ? "#FFD700" : "var(--text-secondary)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      #{i + 1}
                    </span>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: member.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    >
                      {member.avatar}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        color: "var(--text)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {member.name} {member.uid === user.uid && "(you)"}
                    </span>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                      }}
                    >
                      {score}/5
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#FFD70022",
                        borderRadius: "20px",
                        padding: "3px 8px",
                      }}
                    >
                      <Zap size={10} style={{ color: "#FFD700" }} />
                      <span
                        style={{
                          color: "#FFD700",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        +{xpEarned} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                width: "100%",
                padding: "14px",
                background: "var(--primary)",
                border: "none",
                borderRadius: "14px",
                color: "var(--bg)",
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Back to Group
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
