import React, { useState } from "react";

const API = "https://traveller-app-7dyb.onrender.com";

export default function Admin() {

  const [newBus, setNewBus] = useState({
    busNumber: "",
    source: "",
    destination: "",
    totalSeats: "",
    price: "",
  });
const addBus = async () => {
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

    // 🔴 THIS IS IMPORTANT
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend Error:", errorText);
      alert("Failed ❌");
      return;
    }

    const data = await res.json();
    console.log("SUCCESS:", data);

    alert("Bus Added ✅");

  } catch (err) {
    console.error("Network Error:", err);
    alert("Error ❌");
  }
};

  return (
    <div style={{ textAlign:"center" }}>
      <h1>Admin Panel</h1>

      <input placeholder="Bus Number"
        onChange={e=>setNewBus({...newBus,busNumber:e.target.value})}/>
      <br/><br/>

      <input placeholder="Source"
        onChange={e=>setNewBus({...newBus,source:e.target.value})}/>
      <br/><br/>

      <input placeholder="Destination"
        onChange={e=>setNewBus({...newBus,destination:e.target.value})}/>
      <br/><br/>

      <input placeholder="Total Seats"
        onChange={e=>setNewBus({...newBus,totalSeats:e.target.value})}/>
      <br/><br/>

      <input placeholder="Price"
        onChange={e=>setNewBus({...newBus,price:e.target.value})}/>
      <br/><br/>

      <button onClick={addBus}>Add Bus</button>
    </div>
  );
}