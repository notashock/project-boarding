import Booking from "../models/Booking.js";

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { booking_id, seats } = req.body;
    if (!booking_id || !seats || seats.length === 0) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    const existing = await Booking.findOne({ booking_id });
    if (existing) {
      return res.status(409).json({ message: "Booking ID already exists" });
    }

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
