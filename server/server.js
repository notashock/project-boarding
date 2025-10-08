import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import boardingRoutes from "./routes/boardingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // <-- new line

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/boarding-sequence", boardingRoutes);
app.use("/api", uploadRoutes); // <-- new route for Excel upload

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
