import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: Number,
    required: true,
    unique: true,
  },
  seats: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
