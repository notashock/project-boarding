// controllers/uploadController.js
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import Booking from "../models/Booking.js";

/**
 * @desc Upload and parse Excel sheet containing booking_id and seats
 * @route POST /api/upload-bookings
 * @access Public
 */
export const uploadBookings = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = path.resolve(req.file.path);

    // Read and parse Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // Validate columns
    if (!jsonData.length) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Excel sheet is empty." });
    }

    const requiredFields = ["booking_id", "seats"];
    const missingFields = requiredFields.filter(
      (f) => !Object.keys(jsonData[0]).includes(f)
    );

    if (missingFields.length > 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: `Missing required column(s): ${missingFields.join(", ")}`,
      });
    }

    // Process data
    const bookings = jsonData.map((row, index) => {
      const booking_id = row.booking_id;
      const seats = typeof row.seats === "string"
        ? row.seats.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      if (!booking_id || seats.length === 0) {
        throw new Error(`Invalid data at row ${index + 2}`);
      }

      return { booking_id, seats };
    });

    // Save to MongoDB (bulk insert or update)
    const ops = bookings.map((b) => ({
      updateOne: {
        filter: { booking_id: b.booking_id },
        update: { $set: { seats: b.seats } },
        upsert: true, // creates new if not existing
      },
    }));

    await Booking.bulkWrite(ops);

    // Cleanup
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "Bookings uploaded and parsed successfully.",
      totalRecords: bookings.length,
      sample: bookings.slice(0, 5), // show first few for confirmation
    });
  } catch (error) {
    console.error("❌ Upload Error:", error.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // cleanup on error
    }

    res.status(500).json({
      message: "Failed to process Excel file.",
      error: error.message,
    });
  }
};
