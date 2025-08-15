import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import "../Sidebar.css"; 

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Sinun projektisi", path: "/projects" },
    { label: "Viestit", path: "/messages" },
  ];

  return (
    <nav className="sidebar">
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.path}>
            <Button
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
