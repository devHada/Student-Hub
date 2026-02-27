import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

function Notes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const foldersKey = user ? `notes-folders-${user.uid}` : "notes-folders-guest";
  const notesKey = user ? `notes-notes-${user.uid}` : "notes-notes-guest";
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newNoteName, setNewNoteName] = useState("");
  const [search, setSearch] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    highlight: false,
  });
  const editorRef = useRef(null);
  const name = user?.displayName || user?.email?.split("@")[0] || "Student";

  useEffect(() => {
    const savedFolders = localStorage.getItem(foldersKey);
    const savedNotes = localStorage.getItem(notesKey);
    setFolders(savedFolders ? JSON.parse(savedFolders) : []);
    setNotes(savedNotes ? JSON.parse(savedNotes) : []);
    setSelectedFolder(null);
    setSelectedNote(null);
  }, [foldersKey, notesKey]);

  useEffect(() => {
    if (editorRef.current && selectedNote) {
      editorRef.current.innerHTML = selectedNote.content || "";
      editorRef.current.focus();
    }
  }, [selectedNote?.id]);

  function saveFolders(updated) {
    setFolders(updated);
    localStorage.setItem(foldersKey, JSON.stringify(updated));
  }

  function saveNotes(updated) {
    setNotes(updated);
    localStorage.setItem(notesKey, JSON.stringify(updated));
  }

  function addFolder() {
    if (!newFolderName.trim()) return;
    const folder = { id: Date.now().toString(), name: newFolderName.trim() };
    saveFolders([...folders, folder]);
    setNewFolderName("");
    setShowFolderInput(false);
    setSelectedFolder(folder);
  }

  function addNote() {
    if (!newNoteName.trim() || !selectedFolder) return;
    const note = {
      id: Date.now().toString(),
      folderId: selectedFolder.id,
      name: newNoteName.trim(),
      content: "",
    };
    saveNotes([...notes, note]);
    setNewNoteName("");
    setShowNoteInput(false);
    setSelectedNote(note);
  }

  function openNote(note) {
    setSelectedNote(note);
  }

  function handleEditorInput() {
    if (!editorRef.current || !selectedNote) return;
    const html = editorRef.current.innerHTML;
    const updated = notes.map((n) =>
      n.id === selectedNote.id ? { ...n, content: html } : n,
    );
    saveNotes(updated);
  }

  function checkFormats() {
    setActiveFormats((prev) => ({
      ...prev,
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    }));
  }

  function applyFormat(cmd) {
    if (!editorRef.current || !selectedNote) return;
    editorRef.current.focus();
    if (cmd === "highlight") {
      if (activeFormats.highlight) {
        document.execCommand("backColor", false, "transparent");
        setActiveFormats((prev) => ({ ...prev, highlight: false }));
      } else {
        document.execCommand("backColor", false, "#fde047");
        setActiveFormats((prev) => ({ ...prev, highlight: true }));
      }
    } else {
      document.execCommand(cmd, false, undefined);
      checkFormats();
    }
    handleEditorInput();
  }

  function deleteNote(e, id) {
    e.stopPropagation();
    saveNotes(notes.filter((n) => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
  }

  function deleteFolder(e, id) {
    e.stopPropagation();
    saveFolders(folders.filter((f) => f.id !== id));
    saveNotes(notes.filter((n) => n.folderId !== id));
    if (selectedFolder?.id === id) {
      setSelectedFolder(null);
      setSelectedNote(null);
    }
  }

  function startRename(e, id, currentName) {
    e.stopPropagation();
    setRenamingId(id);
    setRenameValue(currentName);
  }

  function submitRename(id, type) {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    if (type === "folder") {
      const updated = folders.map((f) =>
        f.id === id ? { ...f, name: renameValue.trim() } : f,
      );
      saveFolders(updated);
      if (selectedFolder?.id === id)
        setSelectedFolder((prev) => ({ ...prev, name: renameValue.trim() }));
    } else {
      const updated = notes.map((n) =>
        n.id === id ? { ...n, name: renameValue.trim() } : n,
      );
      saveNotes(updated);
      if (selectedNote?.id === id)
        setSelectedNote((prev) => ({ ...prev, name: renameValue.trim() }));
    }
    setRenamingId(null);
  }

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const folderNotes = selectedFolder
    ? notes.filter((n) => n.folderId === selectedFolder.id)
    : [];

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* NAVBAR — same as todos */}
        <div
          className="flex items-center justify-between px-8 py-4"
          style={{
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              📝 Take Notes
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Organize your thoughts by subject and topic
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

        {/* CONTENT — two panels */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL */}
          <div
            className="w-64 flex flex-col overflow-hidden flex-shrink-0"
            style={{
              borderRight: "1px solid var(--border)",
              background: "var(--bg-secondary)",
            }}
          >
            {/* SEARCH */}
            <div
              className="p-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Search folders..."
                className="w-full text-xs px-3 py-2 rounded-xl outline-none"
                style={{
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                }}
              />
            </div>

            {/* FOLDERS */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Folders
                </p>
                <button
                  onClick={() => setShowFolderInput(!showFolderInput)}
                  className="text-xl font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  +
                </button>
              </div>

              <AnimatePresence>
                {showFolderInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-2"
                  >
                    <input
                      autoFocus
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addFolder()}
                      placeholder="Folder name..."
                      className="w-full text-xs px-3 py-2 rounded-xl outline-none"
                      style={{
                        color: "var(--text)",
                        border: "1px solid var(--primary)",
                        background: "var(--card)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredFolders.length === 0 && (
                <p
                  className="text-xs text-center py-4"
                  style={{ color: "var(--text-secondary)", opacity: 0.5 }}
                >
                  {search
                    ? "No folders found"
                    : "No folders yet. Click + to create one."}
                </p>
              )}

              {filteredFolders.map((folder) => (
                <div key={folder.id} className="mb-1">
                  {renamingId === folder.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && submitRename(folder.id, "folder")
                      }
                      onBlur={() => submitRename(folder.id, "folder")}
                      className="w-full text-sm px-3 py-2 rounded-xl outline-none mb-1"
                      style={{
                        color: "var(--text)",
                        border: "1px solid var(--primary)",
                        background: "var(--card)",
                      }}
                    />
                  ) : (
                    <div
                      onClick={() => {
                        setSelectedFolder(folder);
                        setSelectedNote(null);
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-xl group mb-1"
                      style={{
                        background:
                          selectedFolder?.id === folder.id
                            ? "var(--primary)"
                            : "transparent",
                        color:
                          selectedFolder?.id === folder.id
                            ? "white"
                            : "var(--text)",
                        cursor: "pointer",
                      }}
                    >
                      <span className="text-sm font-medium truncate">
                        📁 {folder.name}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={(e) =>
                            startRename(e, folder.id, folder.name)
                          }
                          className="text-xs"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => deleteFolder(e, folder.id)}
                          className="text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedFolder?.id === folder.id && (
                    <div className="ml-3 mb-2">
                      <button
                        onClick={() => setShowNoteInput(!showNoteInput)}
                        className="text-xs mb-2 px-3 py-1 rounded-lg w-full text-left"
                        style={{
                          color: "var(--primary)",
                          background: "var(--card)",
                        }}
                      >
                        + New Note
                      </button>

                      <AnimatePresence>
                        {showNoteInput && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-2"
                          >
                            <input
                              autoFocus
                              value={newNoteName}
                              onChange={(e) => setNewNoteName(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && addNote()}
                              placeholder="Note name..."
                              className="w-full text-xs px-3 py-2 rounded-xl outline-none"
                              style={{
                                color: "var(--text)",
                                border: "1px solid var(--primary)",
                                background: "var(--card)",
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {folderNotes.map((note) =>
                        renamingId === note.id ? (
                          <input
                            key={note.id}
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && submitRename(note.id, "note")
                            }
                            onBlur={() => submitRename(note.id, "note")}
                            className="w-full text-xs px-3 py-2 rounded-xl outline-none mb-1"
                            style={{
                              color: "var(--text)",
                              border: "1px solid var(--primary)",
                              background: "var(--card)",
                            }}
                          />
                        ) : (
                          <div
                            key={note.id}
                            onClick={() => openNote(note)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl mb-1 group"
                            style={{
                              background:
                                selectedNote?.id === note.id
                                  ? "var(--card)"
                                  : "transparent",
                              color: "var(--text)",
                              cursor: "pointer",
                              border:
                                selectedNote?.id === note.id
                                  ? "1px solid var(--border)"
                                  : "1px solid transparent",
                            }}
                          >
                            <span className="text-xs truncate">
                              📄 {note.name}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={(e) =>
                                  startRename(e, note.id, note.name)
                                }
                                className="text-xs"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={(e) => deleteNote(e, note.id)}
                                className="text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EDITOR PANEL */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedNote ? (
              <>
                {/* PATH + TOOLBAR */}
                <div
                  className="flex items-center justify-between px-6 py-3 flex-shrink-0"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--card)",
                  }}
                >
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    📁 {selectedFolder?.name} → 📄 {selectedNote?.name}
                  </p>

                  <div className="flex items-center gap-2">
                    {[
                      { label: "B", cmd: "bold", tw: "font-bold", key: "bold" },
                      {
                        label: "I",
                        cmd: "italic",
                        tw: "italic",
                        key: "italic",
                      },
                      {
                        label: "U",
                        cmd: "underline",
                        tw: "underline",
                        key: "underline",
                      },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyFormat(btn.cmd);
                        }}
                        className={`w-8 h-8 rounded-lg text-sm ${btn.tw} transition-all`}
                        style={{
                          background: activeFormats[btn.key]
                            ? "var(--primary)"
                            : "var(--bg-secondary)",
                          color: activeFormats[btn.key]
                            ? "white"
                            : "var(--text)",
                          border: `1px solid ${activeFormats[btn.key] ? "var(--primary)" : "var(--border)"}`,
                          transform: activeFormats[btn.key]
                            ? "scale(1.1)"
                            : "scale(1)",
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                    <div
                      className="w-px h-5 mx-1"
                      style={{ background: "var(--border)" }}
                    />
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        editorRef.current.focus();
                        if (activeFormats.highlight) {
                          document.execCommand(
                            "foreColor",
                            false,
                            getComputedStyle(document.documentElement)
                              .getPropertyValue("--text")
                              .trim(),
                          );
                          setActiveFormats((prev) => ({
                            ...prev,
                            highlight: false,
                          }));
                        } else {
                          document.execCommand("foreColor", false, "#f59e0b");
                          setActiveFormats((prev) => ({
                            ...prev,
                            highlight: true,
                          }));
                        }
                        handleEditorInput();
                      }}
                      className="text-xs px-3 py-1 rounded-lg font-medium transition-all"
                      style={{
                        background: activeFormats.highlight
                          ? "#f59e0b"
                          : "var(--bg-secondary)",
                        color: activeFormats.highlight
                          ? "white"
                          : "var(--text)",
                        border: `2px solid ${activeFormats.highlight ? "#d97706" : "var(--border)"}`,
                      }}
                    >
                      ✨ Accent
                    </button>
                  </div>
                </div>

                {/* NOTE TITLE */}
                <div
                  className="px-8 py-4 flex-shrink-0"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--text)" }}
                  >
                    {selectedNote.name}
                  </h2>
                </div>

                {/* EDITOR */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  onKeyUp={checkFormats}
                  onMouseUp={checkFormats}
                  className="flex-1 p-8 outline-none overflow-y-auto text-sm leading-relaxed"
                  style={{
                    color: "var(--text)",
                    background: "var(--bg)",
                    fontFamily: "inherit",
                    direction: "ltr",
                    textAlign: "left",
                    minHeight: 0,
                  }}
                />
              </>
            ) : (
              <div
                className="flex-1 flex flex-col items-center justify-center"
                style={{ color: "var(--text-secondary)" }}
              >
                <div className="text-6xl mb-4">📝</div>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--text)" }}
                >
                  Take Notes
                </p>
                <p className="text-sm mt-2">
                  {folders.length === 0
                    ? "Create a folder first, then add notes inside it"
                    : "Select a folder and create a note to start writing"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;
