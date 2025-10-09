import Booking from "../models/Booking.js";

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { booking_id, seats } = req.body;

    // Basic validation
    if (!booking_id || !seats || seats.length === 0) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    // Check for duplicate booking ID
    const existingBooking = await Booking.findOne({ booking_id });
    if (existingBooking) {
      return res.status(409).json({ message: "Booking ID already exists" });
    }

    // Check for seat duplication across all bookings
    const allBookings = await Booking.find({}, "seats");
    const allBookedSeats = allBookings.flatMap((b) => b.seats);

    const duplicateSeats = seats.filter((s) => allBookedSeats.includes(s));

    if (duplicateSeats.length > 0) {
      return res.status(400).json({
        message: "Some seats are already booked.",
        duplicateSeats,
      });
    }

    // Create new booking
    const newBooking = await Booking.create({ booking_id, seats });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
