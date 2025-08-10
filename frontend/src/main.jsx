import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import TaskDetails from "./TaskDetails.jsx";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ProjectsProvider } from "./context/ProjectsContext.jsx";

import "./index.css";

function Root() {
  const { user } = useAuth();

  return user ? (
    <ProjectsProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/task/:taskId" element={<TaskDetails />} />
      </Routes>
    </ProjectsProvider>
  ) : (
    <LoginPage />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
