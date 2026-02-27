import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";
import Notes from "./pages/Notes";
import AIAssistant from "./pages/AIAssistant";
import ProfessorChat from "./pages/ProfessorChat";
import FocusTimer from "./pages/FocusTimer";
import GroupChat from "./pages/GroupChat";
import Board from "./pages/Board";
import LoadingScreen from "./pages/LoadingScreen";
import Toolkit from "./pages/Toolkit";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/loading" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        }
      />
      <Route
        path="/loading"
        element={
          <ProtectedRoute>
            <LoadingScreen />
          </ProtectedRoute>
        }
      />

      <Route path="/todos" element={<Todos />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/focus" element={<FocusTimer />} />
      <Route path="/board" element={<Board />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AIAssistant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/:professor"
        element={
          <ProtectedRoute>
            <ProfessorChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/group"
        element={
          <ProtectedRoute>
            <GroupChat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/toolkit"
        element={
          <ProtectedRoute>
            <Toolkit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
