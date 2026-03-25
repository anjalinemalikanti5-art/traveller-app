import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

export default function SeatBooking({ bus, bookings, user, refreshBookings }) {

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const seatArray = Array.from({ length: bus.totalSeats }, (_, i) => ({
      number: i + 1,
      booked: false
    }));

    bookings.forEach(b => {
      if (b.busNumber === bus.busNumber && b.status === "BOOKED") {
        seatArray[b.seatNumber - 1].booked = true;
      }
    });

    setSeats(seatArray);
  }, [bus, bookings]);

  // SELECT / UNSELECT
  const toggleSeat = (seatNo) => {
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
    } else {
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  // 🔥 PRICE CALCULATION
  const pricePerSeat = 500;
  const totalPrice = selectedSeats.length * pricePerSeat;

  // BOOK
  const bookSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("Select seats first");
      return;
    }

    try {
      for (let seatNo of selectedSeats) {
        await fetch(`${API}/bookings`, {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            travellerName: user.name,
            busNumber: bus.busNumber,
            seatNumber: seatNo,
            travelDate: new Date().toISOString().split("T")[0]
          })
        });
      }

      alert(`Seats booked ✅\nTotal Paid: ₹${totalPrice}`);

      refreshBookings();
      setSelectedSeats([]);

    } catch {
      alert("Some seats already booked ❌");
    }
  };

  const cancelSeat = async (id) => {
    await fetch(`${API}/bookings/cancel/${id}`, { method: "PUT" });
    alert("Cancelled ✅");
    refreshBookings();
  };

  return (
    <div>
      <h2>Seats ({bus.busNumber})</h2>

      {/* 🔥 PRICE DISPLAY */}
      <h3>Price per seat: ₹{pricePerSeat}</h3>
      <h3>Total price: ₹{totalPrice}</h3>

      {seats.map(seat => (
        <button
          key={seat.number}
          disabled={seat.booked}
          onClick={()=>toggleSeat(seat.number)}
          style={{
            margin:"5px",
            backgroundColor: seat.booked
              ? "red"
              : selectedSeats.includes(seat.number)
              ? "blue"
              : "lightgreen"
          }}
        >
          {seat.number}
        </button>
      ))}

      <br/><br/>
      <button onClick={bookSeats}>Book Selected Seats</button>

      <h3>Your Bookings</h3>
      {bookings.filter(b => b.travellerName === user.name).map(b => (
        <div key={b.id}>
          {b.busNumber} Seat {b.seatNumber} ({b.status})

          {b.status === "BOOKED" && (
            <button onClick={()=>cancelSeat(b.id)}>Cancel</button>
          )}
        </div>
      ))}
    </div>
  );
}