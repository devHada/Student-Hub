import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  subscribeToBoardItems,
  addBoardItem,
  deleteBoardItem,
} from "../firebase/board";

import Sidebar from "../components/Sidebar";

function Board() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem("guest-board");
      if (saved) setItems(JSON.parse(saved));
      return;
    }
    const unsub = subscribeToBoardItems(user.uid, (data) => setItems(data));
    return () => unsub();
  }, [user]);

  async function handleAdd() {
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    setNewTitle("");

    if (user) {
      await addBoardItem(user.uid, title);
    } else {
      const newItem = { id: Date.now().toString(), title };
      const updated = [...items, newItem];
      setItems(updated);
      localStorage.setItem("guest-board", JSON.stringify(updated));
    }
  }

  async function handleDelete(id) {
    // update UI instantly
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (user) {
      await deleteBoardItem(id);
    } else {
      const updated = items.filter((item) => item.id !== id);
      localStorage.setItem("guest-board", JSON.stringify(updated));
    }
  }

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* NAVBAR */}
        <div
          className="flex items-center justify-between px-8 py-4"
          style={{
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              📌 Board
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Pin your important reminders and resources
            </p>
          </div>
          <div
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: "var(--primary)", cursor: "pointer" }}
          >
            {user?.email?.[0].toUpperCase() || "?"}
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* ADD NEW ITEM */}
          <div
            className="flex gap-3 mb-8 p-4 rounded-2xl"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add a new board item..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text)" }}
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-lg text-sm text-white font-medium"
              style={{ background: "var(--primary)" }}
            >
              + Add
            </button>
          </div>

          {/* BOARD GRID */}
          <div className="grid grid-cols-3 gap-6">
            <AnimatePresence>
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-3 text-center py-20"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div className="text-6xl mb-4">📌</div>
                  <p className="text-lg font-medium">Your board is empty</p>
                  <p className="text-sm mt-2">
                    Add your syllabus, timetable, or any reminder above
                  </p>
                </motion.div>
              ) : (
                items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl p-6 relative group"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderLeft: "4px solid var(--primary)",
                    }}
                  >
                    <p
                      className="text-sm font-medium pr-6"
                      style={{ color: "var(--text)" }}
                    >
                      {item.title}
                    </p>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded"
                      style={{
                        color: "var(--text-secondary)",
                        background: "var(--bg-secondary)",
                      }}
                    >
                      ✕
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
