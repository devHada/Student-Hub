import { db } from "./config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

function getWeekKey() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return `${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`;
}

export async function createUserProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || user.email.split("@")[0],
      email: user.email,
      xp: 0,
      level: 1,
      streak: 0,
      studyTime: 0,
      weeklyXP: 0,
      weekKey: getWeekKey(),
      lastActive: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  return null;
}

export async function updateXP(uid, amount) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const current = snap.data();
  const newXP = current.xp + amount;
  const newLevel = Math.floor(newXP / 1000) + 1;

  const currentWeekKey = getWeekKey();
  const isNewWeek = current.weekKey !== currentWeekKey;

  await updateDoc(ref, {
    xp: newXP,
    level: newLevel,
    weeklyXP: isNewWeek ? amount : (current.weeklyXP || 0) + amount,
    weekKey: currentWeekKey,
  });
}

export async function updateStudyTime(uid, secondsToAdd) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const current = snap.data();
  const xpGained = Math.floor(secondsToAdd / 60);
  const newXP = current.xp + xpGained;

  const currentWeekKey = getWeekKey();
  const isNewWeek = current.weekKey !== currentWeekKey;

  await updateDoc(ref, {
    studyTime: (current.studyTime || 0) + secondsToAdd,
    xp: newXP,
    weeklyXP: isNewWeek ? xpGained : (current.weeklyXP || 0) + xpGained,
    weekKey: currentWeekKey,
    lastActive: serverTimestamp(),
  });
}

export async function updateUserProfile(uid, updates) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, updates, { merge: true });
}
