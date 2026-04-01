import React, { useState } from "react";

export default function SearchBus({ onSearch, buses, onSelectBus }) {

  const [search, setSearch] = useState({ source: "", destination: "" });

  return (
    <div className="container card card-wide" style={{ marginBottom: "30px" }}>
      <h2>Search for a Bus</h2>

      <div className="search-bar">
        <input className="input-field" placeholder="Source City"
          onChange={e=>setSearch({...search,source:e.target.value})}
        />
        <input className="input-field" placeholder="Destination City"
          onChange={e=>setSearch({...search,destination:e.target.value})}
        />
        <button className="btn btn-primary" onClick={()=>onSearch(search)}>Search</button>
      </div>

      {Array.isArray(buses) && buses.length > 0 && (
        <>
          <h3>Available Buses</h3>
          <div className="bus-list">
            {buses.map(bus => (
              <div key={bus.id} className="bus-card">
                <div className="bus-details">
                  <h3>Bus {bus.busNumber}</h3>
                  <p>Total Seats: {bus.totalSeats} &bull; Price per seat: ₹{bus.price}</p>
                </div>

                <button className="btn btn-outline" style={{ width: "auto" }} onClick={()=>onSelectBus(bus)}>
                  View Seats
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}