import React, { useState } from "react";
import Admin from "./Admin";
import User from "./User";

export default function App() {

  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div className="center-wrapper">
        <div className="card" style={{ textAlign: "center" }}>
          <h2>Select Login Role</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Welcome to Traveller App. Please select your role to continue.</p>
          <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
            <button className="btn btn-primary" onClick={() => setRole("ADMIN")}>Admin Login</button>
            <button className="btn btn-outline" onClick={() => setRole("USER")}>User Login</button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setRole(null);
  };

  return role === "ADMIN" ? <Admin onLogout={handleLogout} /> : <User onLogout={handleLogout} />;
}