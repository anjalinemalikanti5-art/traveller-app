import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

export default function SeatBooking({ bus, bookings, user, refreshBookings }) {

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (!bus) return;

    const seatArray = Array.from({ length: bus.totalSeats }, (_, i) => ({
      number: i + 1,
      booked: false
    }));

    bookings.forEach(b => {
      if (
        b.busNumber &&
        bus.busNumber &&
        String(b.busNumber).toLowerCase() ===
        String(bus.busNumber).toLowerCase() &&
        b.status === "BOOKED"
      ) {
        const index = b.seatNumber - 1;

        if (index >= 0 && index < seatArray.length) {
          seatArray[index].booked = true;
        }
      }
    });

    setSeats(seatArray);

  }, [bus, bookings]);

  const toggleSeat = (seatNo) => {
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
    } else {
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  const totalPrice = selectedSeats.length * bus.price;

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
            seatNumber: seatNo
          })
        });
      }

      await refreshBookings();   // 🔥 refresh data
      setSelectedSeats([]);

      alert(`Booked ✅ ₹${totalPrice}`);

    } catch {
      alert("Booking failed ❌");
    }
  };

  return (
    <div>
      <h2>Seats ({bus.busNumber})</h2>

      <h3>Total Price: ₹{totalPrice}</h3>

      {seats.map(seat => (
        <button
          key={seat.number}
          disabled={seat.booked}
          onClick={()=>toggleSeat(seat.number)}
          style={{
            margin:"5px",
            padding:"10px",
            backgroundColor: seat.booked
              ? "red"        // 🔴 BOOKED
              : selectedSeats.includes(seat.number)
              ? "blue"       // 🔵 SELECTED
              : "lightgreen" // 🟢 AVAILABLE
          }}
        >
          {seat.number}
        </button>
      ))}

      <br/><br/>
      <button onClick={bookSeats}>Book Selected Seats</button>
    </div>
  );
}