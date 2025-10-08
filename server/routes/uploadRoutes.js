// routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import { uploadBookings } from "../controllers/uploadController.js";

const router = express.Router();

// Multer config for Excel files
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
      return cb(new Error("Only .xls or .xlsx files are allowed!"));
    }
    cb(null, true);
  },
});

router.post("/upload-bookings", upload.single("file"), uploadBookings);

export default router;
