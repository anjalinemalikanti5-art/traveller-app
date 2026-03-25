import React, { useEffect, useState } from "react";
import SearchBus from "./SearchBus";
import SeatBooking from "./SeatBooking";

const API = "http://localhost:8080/api";

export default function User() {

  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ name: "", email: "" });

  const [filtered, setFiltered] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    const res = await fetch(`${API}/bookings`);
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
  };

  const handleLogin = () => setUser(loginForm);

  const handleSearch = async (search) => {
    try {
      const res = await fetch(
        `${API}/buses/search?source=${search.source}&destination=${search.destination}`
      );
      const data = await res.json();

      if (data.length === 0) alert("No buses found");

      setFiltered(data);
    } catch {
      alert("Search failed");
    }
  };

  // LOGIN
if (!user) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>User Login</h2>

      <input
        placeholder="Enter Name"
        value={loginForm.name}
        onChange={(e) =>
          setLoginForm({ ...loginForm, name: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Enter Email"
        value={loginForm.email}
        onChange={(e) =>
          setLoginForm({ ...loginForm, email: e.target.value })
        }
      />
      <br /><br />

      <button
        onClick={() => {
          // 🔥 VALIDATION LOGIC
          if (!loginForm.name || !loginForm.email) {
            alert("Please fill all fields ❗");
            return;
          }

          if (!loginForm.email.includes("@")) {
            alert("Enter valid email ❗");
            return;
          }

          // 🔥 SET USER
          setUser({
            name: loginForm.name,
            email: loginForm.email
          });

          alert("Login Successful ✅");
        }}
      >
        Login
      </button>
    </div>
  );
}

  // USER UI
  return (
    <div>
      <h1>Welcome, {user.name}</h1>

     <SearchBus
  onSearch={handleSearch}
  buses={filtered}
  onSelectBus={setSelectedBus}
/>

{/* 🔥 THIS IS IMPORTANT */}
{selectedBus && (
  <SeatBooking
    bus={selectedBus}
    bookings={bookings}
    user={user}
    refreshBookings={fetchBookings}
  />
)}
    </div>
  );
}