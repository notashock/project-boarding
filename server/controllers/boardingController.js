import Booking from "../models/Booking.js";

// Extract row number from seat string (e.g., A12 → 12)
const extractSeatNumber = (seat) => {
  const num = seat.match(/\d+/);
  return num ? parseInt(num[0], 10) : 0;
};

// GET /api/boarding-sequence
export const getBoardingSequence = async (req, res) => {
  try {
    const bookings = await Booking.find();

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Flatten all seats with their metadata
    let allSeats = bookings.flatMap((b) =>
      b.seats.map((seat) => ({
        booking_id: b.booking_id,
        seat,
        col: seat[0].toUpperCase(),
        row: extractSeatNumber(seat),
      }))
    );

    // ✅ Window seats have first priority (A, D)
    // ✅ Middle/Aisle seats come after (B, C)
    const windowCols = ["A", "D"];
    const middleCols = ["B", "C"];

    // Separate and sort each group
    const windowSeats = allSeats
      .filter((s) => windowCols.includes(s.col))
      .sort((a, b) => b.row - a.row); // Back to front

    const middleSeats = allSeats
      .filter((s) => middleCols.includes(s.col))
      .sort((a, b) => b.row - a.row); // Back to front

    // Combine final sequence
    const finalSeats = [...windowSeats, ...middleSeats];

    // Assign sequence numbers
    const sequence = finalSeats.map((s, i) => ({
      seq: i + 1,
      booking_id: s.booking_id,
      seat: s.seat,
    }));

    res.json({
      strategy: "window-first-max-boarding",
      totalSeats: sequence.length,
      sequence,
    });
  } catch (error) {
    console.error("❌ Boarding sequence error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
