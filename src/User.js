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
      const res = await fetch(
        `${API}/buses/search?source=${search.source}&destination=${search.destination}`
      );

      const data = await res.json();
      setFiltered(Array.isArray(data) ? data : []);

      if (data.length === 0) alert("No buses found ❌");

    } catch {
      alert("Search failed ❌");
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign:"center", marginTop:"100px" }}>
        <h2>User Login</h2>

        <input
          placeholder="Name"
          onChange={e=>setLoginForm({...loginForm,name:e.target.value})}
        />
        <br/><br/>

        <input
          placeholder="Email"
          onChange={e=>setLoginForm({...loginForm,email:e.target.value})}
        />
        <br/><br/>

        <button onClick={()=>{
          if(!loginForm.name || !loginForm.email){
            alert("Fill all fields");
            return;
          }
          setUser(loginForm);
        }}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

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