import React, { useState } from "react";

export default function SearchBus({ onSearch, buses, onSelectBus }) {

  const [search, setSearch] = useState({ source: "", destination: "" });

  return (
    <div>
      <h2>Search Bus</h2>

      <input placeholder="Source"
        onChange={e=>setSearch({...search,source:e.target.value})}
      />

      <input placeholder="Destination"
        onChange={e=>setSearch({...search,destination:e.target.value})}
      />

      <button onClick={()=>onSearch(search)}>Search</button>

      <h3>Available Buses</h3>

      {Array.isArray(buses) && buses.map(bus => (
        <div key={bus.id}>
          <p>
            {bus.busNumber} | Seats: {bus.totalSeats} | ₹{bus.price}
          </p>

          <button onClick={()=>onSelectBus(bus)}>
            View Seats
          </button>
        </div>
      ))}
    </div>
  );
}