import Booking from "../models/Booking.js";

const extractSeatNumber = (seat) => {
  const num = seat.match(/\d+/);
  return num ? parseInt(num[0], 10) : 0;
};

// GET /api/boarding-sequence
// Optional query: ?strategy=max or ?strategy=min
export const getBoardingSequence = async (req, res) => {
  try {
    const { strategy = "max" } = req.query; // defaults to min if not provided

    const bookings = await Booking.find();

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // calculate row number (minRow or maxRow depending on strategy)
    const processed = bookings.map((b) => {
      const seatNumbers = b.seats.map(extractSeatNumber);
      const refRow =
        strategy === "max"
          ? Math.max(...seatNumbers)
          : Math.min(...seatNumbers);
      return { ...b._doc, refRow };
    });

    // sort logic
    processed.sort((a, b) => {
      if (a.refRow === b.refRow) {
        return a.booking_id - b.booking_id; // tie-breaker
      }

      return strategy === "max"
        ? b.refRow - a.refRow // back to front
        : a.refRow - b.refRow; // front to back
    });

    const sequence = processed.map((b, i) => ({
      seq: i + 1,
      booking_id: b.booking_id,
      seats: b.seats,
    }));

    res.json({
      strategy,
      totalBookings: sequence.length,
      sequence,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
