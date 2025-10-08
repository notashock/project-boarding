import Booking from "../models/Booking.js";

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

    const processed = bookings.map((b) => {
      const maxRow = Math.max(...b.seats.map(extractSeatNumber));
      return { ...b._doc, maxRow };
    });

    processed.sort((a, b) => {
      if (b.maxRow === a.maxRow) return a.booking_id - b.booking_id;
      return b.maxRow - a.maxRow;
    });

    const sequence = processed.map((b, i) => ({
      seq: i + 1,
      booking_id: b.booking_id,
      seats: b.seats,
    }));

    res.json(sequence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
