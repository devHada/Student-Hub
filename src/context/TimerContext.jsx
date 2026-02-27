import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { updateStudyTime } from "../firebase/users";

const TimerContext = createContext(null);

export function useTimer() {
  return useContext(TimerContext);
}

function getStorageKey(uid) {
  return uid ? `focustimer-settings-${uid}` : "focustimer-settings-guest";
}

function getStatsKey(uid) {
  return uid ? `timer-stats-${uid}` : "timer-stats-guest";
}

function loadSettings(uid) {
  try {
    const raw = localStorage.getItem(getStorageKey(uid));
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { workDuration: 25, breakDuration: 5 };
}

function loadStats(uid) {
  try {
    const raw = localStorage.getItem(getStatsKey(uid));
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { sessionCount: 0, totalSeconds: 0 };
}

function saveSettings(uid, workDuration, breakDuration) {
  try {
    localStorage.setItem(
      getStorageKey(uid),
      JSON.stringify({ workDuration, breakDuration }),
    );
  } catch (e) {}
}

function saveStats(uid, sessionCount, totalSeconds) {
  try {
    localStorage.setItem(
      getStatsKey(uid),
      JSON.stringify({ sessionCount, totalSeconds }),
    );
  } catch (e) {}
}

function sendNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
}

export default function TimerProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.uid || null;

  const saved = loadSettings(uid);
  const stats = loadStats(uid);

  const [workDuration, setWorkDuration] = useState(saved.workDuration);
  const [breakDuration, setBreakDuration] = useState(saved.breakDuration);
  const [timeLeft, setTimeLeft] = useState(saved.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(stats.sessionCount);
  const [totalSeconds, setTotalSeconds] = useState(stats.totalSeconds);

  const timerRef = useRef(null);
  const sessionSecondsRef = useRef(0);

  const workDurationRef = useRef(saved.workDuration);
  const breakDurationRef = useRef(saved.breakDuration);
  const isBreakRef = useRef(false);
  const uidRef = useRef(uid);
  const sessionCountRef = useRef(stats.sessionCount);
  const totalSecondsRef = useRef(stats.totalSeconds);

  useEffect(
    function () {
      workDurationRef.current = workDuration;
    },
    [workDuration],
  );
  useEffect(
    function () {
      breakDurationRef.current = breakDuration;
    },
    [breakDuration],
  );
  useEffect(
    function () {
      isBreakRef.current = isBreak;
    },
    [isBreak],
  );
  useEffect(
    function () {
      uidRef.current = uid;
    },
    [uid],
  );
  useEffect(
    function () {
      sessionCountRef.current = sessionCount;
    },
    [sessionCount],
  );
  useEffect(
    function () {
      totalSecondsRef.current = totalSeconds;
    },
    [totalSeconds],
  );

  // Save stats to localStorage whenever they change
  useEffect(
    function () {
      saveStats(uid, sessionCount, totalSeconds);
    },
    [sessionCount, totalSeconds],
  );

  // Request notification permission
  useEffect(function () {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Reload everything when user changes
  useEffect(
    function () {
      const s = loadSettings(uid);
      const st = loadStats(uid);

      setWorkDuration(s.workDuration);
      setBreakDuration(s.breakDuration);
      workDurationRef.current = s.workDuration;
      breakDurationRef.current = s.breakDuration;

      setTimeLeft(s.workDuration * 60);
      setIsRunning(false);
      setIsBreak(false);
      isBreakRef.current = false;
      sessionSecondsRef.current = 0;

      setSessionCount(st.sessionCount);
      setTotalSeconds(st.totalSeconds);
      sessionCountRef.current = st.sessionCount;
      totalSecondsRef.current = st.totalSeconds;
    },
    [uid],
  );

  async function handleSessionEnd() {
    const currentIsBreak = isBreakRef.current;
    const currentBreakDuration = breakDurationRef.current;
    const currentWorkDuration = workDurationRef.current;
    const currentUid = uidRef.current;

    if (!currentIsBreak) {
      const newCount = sessionCountRef.current + 1;
      setSessionCount(newCount);
      sessionCountRef.current = newCount;

      try {
        if (currentUid && sessionSecondsRef.current > 0) {
          await updateStudyTime(currentUid, sessionSecondsRef.current);
        }
      } catch (e) {
        console.log("Study time save failed:", e.message);
      }

      sessionSecondsRef.current = 0;

      sendNotification(
        "Work session complete! 🎉",
        `Great focus! Take a ${currentBreakDuration} minute break.`,
      );

      isBreakRef.current = true;
      setIsBreak(true);
      setTimeLeft(currentBreakDuration * 60);
      setIsRunning(false);
      setTimeout(function () {
        setIsRunning(true);
      }, 100);
    } else {
      sendNotification(
        "Break over! 💪",
        "Time to get back to work. You got this.",
      );

      isBreakRef.current = false;
      setIsBreak(false);
      setTimeLeft(currentWorkDuration * 60);
      setIsRunning(false);
      setTimeout(function () {
        setIsRunning(true);
      }, 100);
    }
  }

  // Timer tick
  useEffect(
    function () {
      if (isRunning) {
        timerRef.current = setInterval(function () {
          setTimeLeft(function (prev) {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleSessionEnd();
              return 0;
            }
            if (!isBreakRef.current) {
              sessionSecondsRef.current += 1;
              const newTotal = totalSecondsRef.current + 1;
              totalSecondsRef.current = newTotal;
              setTotalSeconds(newTotal);
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        clearInterval(timerRef.current);
      }
      return function () {
        clearInterval(timerRef.current);
      };
    },
    [isRunning],
  );

  function toggleTimer() {
    setIsRunning(function (p) {
      return !p;
    });
  }

  function resetTimer() {
    setIsRunning(false);
    setIsBreak(false);
    isBreakRef.current = false;
    setTimeLeft(workDurationRef.current * 60);
    sessionSecondsRef.current = 0;
  }

  function applySettings(newWork, newBreak) {
    setWorkDuration(newWork);
    setBreakDuration(newBreak);
    workDurationRef.current = newWork;
    breakDurationRef.current = newBreak;
    setTimeLeft(newWork * 60);
    setIsRunning(false);
    setIsBreak(false);
    isBreakRef.current = false;
    saveSettings(uid, newWork, newBreak);
  }

  const totalDuration = isBreak ? breakDuration * 60 : workDuration * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <TimerContext.Provider
      value={{
        workDuration,
        breakDuration,
        timeLeft,
        isRunning,
        isBreak,
        sessionCount,
        totalSeconds,
        progress,
        minutes,
        seconds,
        toggleTimer,
        resetTimer,
        applySettings,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
