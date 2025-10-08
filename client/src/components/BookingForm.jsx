import { useState } from "react";

export default function BookingForm({ onBookingCreated }) {
  const [bookingId, setBookingId] = useState("");
  const [seats, setSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: parseInt(bookingId),
          seats: seats.split(",").map((s) => s.trim()),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create booking");
      }

      const createdBooking = await response.json();
      onBookingCreated(createdBooking);
      setBookingId("");
      setSeats("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 max-w-md mx-auto my-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Booking</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          placeholder="Seats (comma separated, e.g. A1,B2)"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Add Booking"}
        </button>
      </form>
    </div>
  );
}
