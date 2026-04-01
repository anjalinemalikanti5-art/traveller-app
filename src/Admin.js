import React, { useState } from "react";

//const API = "https://traveller-app-7dyb.onrender.com";
const API = "https://traveller-backend-z13f.onrender.com";

export default function Admin({ onLogout }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [newBus, setNewBus] = useState({
    busNumber: "",
    source: "",
    destination: "",
    totalSeats: "",
    price: "",
  });

  const addBus = async () => {
    // Basic validation
    if (!newBus.busNumber || !newBus.source || !newBus.destination || !newBus.totalSeats || !newBus.price) {
      alert("Please fill all details!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/buses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBus,
          totalSeats: Number(newBus.totalSeats),
          price: Number(newBus.price)
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend Error:", errorText);
        alert("Failed ❌");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("SUCCESS:", data);

      alert("Bus Added ✅");
      setMessage("Bus added successfully!");

      // Reset the form
      setNewBus({
        busNumber: "",
        source: "",
        destination: "",
        totalSeats: "",
        price: "",
      });

    } catch (err) {
      console.error("Network Error:", err);
      alert("Error ❌ - " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="center-wrapper" style={{ height: "auto", minHeight: "80vh" }}>
        <div className="card">
          <h2 style={{ marginBottom: "25px", textAlign: "center" }}>Admin Panel</h2>

          <div className="form-group">
            <input className="input-field" placeholder="Bus Number"
              value={newBus.busNumber}
              onChange={e => setNewBus({ ...newBus, busNumber: e.target.value })} />
          </div>

          <div className="form-group">
            <input className="input-field" placeholder="Source"
              value={newBus.source}
              onChange={e => setNewBus({ ...newBus, source: e.target.value })} />
          </div>

          <div className="form-group">
            <input className="input-field" placeholder="Destination"
              value={newBus.destination}
              onChange={e => setNewBus({ ...newBus, destination: e.target.value })} />
          </div>

          <div className="form-group">
            <input className="input-field" placeholder="Total Seats"
              value={newBus.totalSeats}
              onChange={e => setNewBus({ ...newBus, totalSeats: e.target.value })} />
          </div>

          <div className="form-group">
            <input className="input-field" placeholder="Price"
              value={newBus.price}
              onChange={e => setNewBus({ ...newBus, price: e.target.value })} />
          </div>

          <button className="btn btn-primary" onClick={addBus} disabled={loading} style={{ marginBottom: "15px" }}>
            {loading ? "Adding Bus... Please wait..." : "Add Bus"}
          </button>

          {message && <p style={{ color: "var(--seat-available-border)", textAlign: "center", fontWeight: "500" }}>{message}</p>}

          <button className="btn btn-outline" onClick={onLogout}>
            Logout Session
          </button>
        </div>
      </div>
    </div>
  );
}