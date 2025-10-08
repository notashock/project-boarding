import { useState } from "react";
import useFetcher from "../hooks/useFetcher";

export default function BookingForm({ onUploadSuccess }) {
  const [bookingId, setBookingId] = useState("");
  const [seats, setSeats] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const fetcher = useFetcher(); // ✅ Correct use

  const MAX_SEATS = 20;
  const VALID_COLUMNS = ["A", "B", "C", "D"];

  // Validate seats for constraints
  const validateSeats = (seatArray) => {
    for (let seat of seatArray) {
      const match = seat.match(/^([A-Z]+)(\d+)$/);
      if (!match) return `Invalid seat format: ${seat}`;
      const [_, col, rowStr] = match;
      const row = parseInt(rowStr, 10);
      if (!VALID_COLUMNS.includes(col)) return `Invalid column: ${col}, choose from ${VALID_COLUMNS.join(", ")}`;
      if (row > MAX_SEATS) return `Seat number too high: ${seat} (max ${MAX_SEATS})`;
    }
    return null; // valid
  };

  // Manual booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingId || !seats) return setMessage("Booking ID and Seats are required.");

    const seatArray = seats.split(",").map((s) => s.trim());
    const error = validateSeats(seatArray);
    if (error) return setMessage(error);

    try {
      await fetcher("/bookings", {
        method: "POST",
        body: JSON.stringify({
          booking_id: bookingId,
          seats: seatArray,
        }),
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Booking added successfully!");
      setBookingId("");
      setSeats("");
      onUploadSuccess && onUploadSuccess();
    } catch (err) {
      setMessage(err.message || "Failed to add booking.");
    }
  };

  // File upload selection
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // Excel upload submission
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await fetcher("/upload-bookings", {
        method: "POST",
        body: formData,
      });

      setMessage(`${result.totalRecords || 0} bookings uploaded successfully!`);
      setFile(null);
      onUploadSuccess && onUploadSuccess();
    } catch (err) {
      setMessage(err.message || "File upload failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Add Booking / Upload Excel</h2>

      {message && <p className="mb-4 text-center text-red-600">{message}</p>}

      {/* Manual Booking Form */}
      <form onSubmit={handleBookingSubmit} className="mb-6">
        <div className="mb-3">
          <label className="block font-medium mb-1">Booking ID</label>
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Seats (comma separated)</label>
          <input
            type="text"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Booking
        </button>
      </form>

      <hr className="my-4" />

      {/* Excel Upload Form */}
      <form onSubmit={handleFileUpload}>
        <div className="mb-3">
          <label className="block font-medium mb-1">Upload Excel (.xlsx)</label>
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Upload File
        </button>
      </form>
    </div>
  );
}
