import { db } from "./config";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export function subscribeToTodos(userId, callback) {
  const q = query(collection(db, "todos"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const todos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(todos);
  });
}

export async function addTodo(userId, { title, priority, dueTime, subject }) {
  await addDoc(collection(db, "todos"), {
    userId,
    title,
    priority,
    dueTime,
    subject,
    completed: false,
    createdAt: serverTimestamp(),
  });
}

export async function toggleTodo(todoId, completed) {
  await updateDoc(doc(db, "todos", todoId), { completed });
}

export async function deleteTodo(todoId) {
  await deleteDoc(doc(db, "todos", todoId));
}
