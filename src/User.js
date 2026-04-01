import React, { useEffect, useState } from "react";
import SearchBus from "./SearchBus";
import SeatBooking from "./SeatBooking";

const API = "https://traveller-backend-z13f.onrender.com/api";

export default function User({ onLogout }) {

  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ name: "", email: "" });

  const [filtered, setFiltered] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API}/bookings`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    }
  };

  const handleSearch = async (search) => {
    try {
      // Fetch all buses, then filter locally to ensure true case-insensitivity
      const res = await fetch(`${API}/buses`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch buses");
      }

      const allBuses = await res.json();
      
      const searchSource = search.source.trim().toLowerCase();
      const searchDest = search.destination.trim().toLowerCase();

      const matchedBuses = (Array.isArray(allBuses) ? allBuses : []).filter(bus => 
        bus.source && bus.destination &&
        bus.source.trim().toLowerCase() === searchSource &&
        bus.destination.trim().toLowerCase() === searchDest
      );

      setFiltered(matchedBuses);

      if (matchedBuses.length === 0) alert("No buses found ❌");

    } catch (err) {
      console.error(err);
      alert("Search failed ❌");
    }
  };

  if (!user) {
    return (
      <div className="center-wrapper">
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "25px" }}>User Login</h2>
          
          <div className="form-group">
            <input className="input-field" placeholder="Name"
              onChange={e=>setLoginForm({...loginForm,name:e.target.value})} />
          </div>

          <div className="form-group">
            <input className="input-field" placeholder="Email"
              onChange={e=>setLoginForm({...loginForm,email:e.target.value})} />
          </div>

          <button className="btn btn-primary" style={{ marginBottom: "15px" }} onClick={()=>{
            if(!loginForm.name || !loginForm.email){
              alert("Fill all fields");
              return;
            }
            setUser(loginForm);
          }}>
            Login
          </button>
          
          <button className="btn btn-outline" onClick={onLogout}>
            Back to Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: "40px auto" }}>
      <div className="top-header">
        <h1>Welcome, {user.name}</h1>
        <button className="btn btn-danger" style={{ width: "auto" }} onClick={onLogout}>
          Logout
        </button>
      </div>

      <SearchBus
        onSearch={handleSearch}
        buses={filtered}
        onSelectBus={setSelectedBus}
      />

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