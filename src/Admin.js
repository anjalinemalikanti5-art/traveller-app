import React, { useState } from "react";

const API = "https://traveller-backend-d1sq.onrender.com";

export default function Admin() {

  const [newBus, setNewBus] = useState({
    busNumber: "",
    source: "",
    destination: "",
    totalSeats: "",
    price: ""
  });

  const addBus = async () => {
    await fetch(`${API}/buses`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(newBus)
    });
    alert("Bus Added ✅");
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