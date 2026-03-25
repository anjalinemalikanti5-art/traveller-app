import React, { useState } from "react";
import Admin from "./Admin";
import User from "./User";

export default function App() {

  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div style={{ textAlign:"center", marginTop:"100px" }}>
        <h2>Select Login</h2>
        <button onClick={()=>setRole("ADMIN")}>Admin</button>
        <button onClick={()=>setRole("USER")}>User</button>
      </div>
    );
  }

  return role === "ADMIN" ? <Admin /> : <User />;
}