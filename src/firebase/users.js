import { db } from "./config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

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
  await updateDoc(ref, { xp: newXP, level: newLevel });
}

export async function updateStudyTime(uid, secondsToAdd) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const current = snap.data();
  await updateDoc(ref, {
    studyTime: (current.studyTime || 0) + secondsToAdd,
    xp: current.xp + Math.floor(secondsToAdd / 60),
    lastActive: serverTimestamp(),
  });
}

export async function updateUserProfile(uid, updates) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, updates, { merge: true });
}
