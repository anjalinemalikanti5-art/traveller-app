import React, { useEffect, useState } from "react";

const API = "https://traveller-backend-z13f.onrender.com/api";

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
    <div className="container">
      <div className="seat-booking-panel">
        <h2>Select Seats for {bus.busNumber}</h2>

        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-box seat-available"></div> Available
          </div>
          <div className="legend-item">
            <div className="legend-box seat-selected"></div> Selected
          </div>
          <div className="legend-item">
            <div className="legend-box seat-booked"></div> Booked
          </div>
        </div>

        <div className="seats-grid">
          {seats.map(seat => {
            let seatClass = "seat-available";
            if (seat.booked) seatClass = "seat-booked";
            else if (selectedSeats.includes(seat.number)) seatClass = "seat-selected";

            return (
              <button
                key={seat.number}
                disabled={seat.booked}
                onClick={() => toggleSeat(seat.number)}
                className={`seat ${seatClass}`}
              >
                {seat.number}
              </button>
            );
          })}
        </div>

        <div className="booking-summary">
          <div>
            <p style={{ margin: "0 0 5px 0", color: "var(--text-muted)" }}>Total Selected: {selectedSeats.length} seats</p>
            <h3>Total Price: ₹{totalPrice}</h3>
          </div>
          <button className="btn btn-primary" style={{ width: "auto", padding: "12px 30px" }} onClick={bookSeats}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}