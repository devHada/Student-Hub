import { db } from "./config";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export function subscribeToBoardItems(userId, callback) {
  const q = query(collection(db, "board"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export async function addBoardItem(userId, title) {
  await addDoc(collection(db, "board"), {
    userId,
    title,
    createdAt: serverTimestamp(),
  });
}

export async function deleteBoardItem(itemId) {
  await deleteDoc(doc(db, "board", itemId));
}
