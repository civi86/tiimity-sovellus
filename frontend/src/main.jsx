import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import TaskDetails from "./TaskDetails.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ProjectsProvider } from "./context/ProjectsContext.jsx";
import "./index.css";

function PrivateRoute({ children }) {
  const { username, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return username ? children : <Navigate to="/login" replace />;
}

function AuthWatcher({ children }) {
  const { username } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (username === null) navigate("/login", { replace: true });
  }, [username]);

  return children;
}

function RootRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <ProjectsProvider>
              <Routes>
                <Route path="dashboard" element={<App />} />
                <Route path="task/:taskId" element={<TaskDetails />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </ProjectsProvider>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AuthWatcher>
          <RootRoutes />
        </AuthWatcher>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
