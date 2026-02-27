import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const priorities = [
  { label: "High", color: "#ef4444" },
  { label: "Medium", color: "#f59e0b" },
  { label: "Low", color: "#22c55e" },
];

function Todos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const storageKey = user ? `todos-${user.uid}` : "todos-guest";
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [subject, setSubject] = useState("");
  const [activeTab, setActiveTab] = useState("Active");
  const name = user?.displayName || user?.email?.split("@")[0] || "Student";

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setTodos(JSON.parse(saved));
    else setTodos([]);
  }, [storageKey]);

  function save(updated) {
    setTodos(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  function handleAdd() {
    if (!title.trim()) return;
    const newTodo = {
      id: Date.now().toString(),
      title: title.trim(),
      priority,
      subject,
      completed: false,
    };
    save([...todos, newTodo]);
    setTitle("");
    setSubject("");
    setPriority("Medium");
  }

  function handleToggle(id) {
    save(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  function handleDelete(id) {
    save(todos.filter((t) => t.id !== id));
  }

  const filteredTodos = todos.filter((t) =>
    activeTab === "Active" ? !t.completed : t.completed,
  );

  const selectedPriority = priorities.find((p) => p.label === priority);

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
              ✅ Tasks & Todos
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Stay on top of your tasks and never miss a deadline
            </p>
          </div>
          <div
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: "var(--primary)", cursor: "pointer" }}
          >
            {name[0].toUpperCase()}
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* ADD TASK */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add new task..."
              className="w-full bg-transparent outline-none text-lg mb-4 font-medium"
              style={{
                color: "var(--text)",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "12px",
              }}
            />

            <div className="flex items-center gap-6 flex-wrap">
              {/* PRIORITY */}
              <div className="flex items-center gap-2">
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Priority:
                </span>
                <div className="flex gap-2 items-center">
                  {priorities.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setPriority(p.label)}
                      className="w-6 h-6 rounded-full transition-all"
                      style={{
                        background: p.color,
                        outline:
                          priority === p.label
                            ? `2px solid ${p.color}`
                            : "none",
                        outlineOffset: "2px",
                        opacity: priority === p.label ? 1 : 0.4,
                      }}
                    />
                  ))}
                  <span
                    className="text-sm ml-1"
                    style={{ color: selectedPriority.color }}
                  >
                    {priority}
                  </span>
                </div>
              </div>

              {/* SUBJECT */}
              <div className="flex items-center gap-2">
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Subject:
                </span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Maths"
                  className="text-sm px-2 py-1 rounded-lg outline-none"
                  style={{
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    background: "var(--bg-secondary)",
                    width: "100px",
                  }}
                />
              </div>

              <button
                onClick={handleAdd}
                className="ml-auto px-6 py-2 rounded-lg text-sm text-white font-medium"
                style={{ background: "var(--primary)" }}
              >
                + Add Task
              </button>
            </div>
          </div>

          {/* TABS */}
          <div
            className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {["Active", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background:
                    activeTab === tab ? "var(--primary)" : "transparent",
                  color: activeTab === tab ? "white" : "var(--text-secondary)",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* LIST */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTodos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-lg font-medium">No tasks here</p>
                  <p className="text-sm mt-2">
                    Add a task above to get started
                  </p>
                </motion.div>
              ) : (
                filteredTodos.map((todo, i) => {
                  const todoPriority = priorities.find(
                    (p) => p.label === todo.priority,
                  );
                  return (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl group"
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderLeft: `4px solid ${todoPriority?.color || "var(--primary)"}`,
                        opacity: todo.completed ? 0.6 : 1,
                      }}
                    >
                      <button
                        onClick={() => handleToggle(todo.id)}
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: todoPriority?.color || "var(--primary)",
                          background: todo.completed
                            ? todoPriority?.color
                            : "transparent",
                        }}
                      >
                        {todo.completed && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </button>

                      <p
                        className="flex-1 text-sm font-medium"
                        style={{
                          color: "var(--text)",
                          textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {todo.title}
                      </p>

                      {todo.subject && (
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: "var(--bg-secondary)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {todo.subject}
                        </span>
                      )}

                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded"
                        style={{
                          color: "var(--text-secondary)",
                          background: "var(--bg-secondary)",
                        }}
                      >
                        ✕
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todos;
