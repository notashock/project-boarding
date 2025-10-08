import express from "express";
import { getBoardingSequence } from "../controllers/boardingController.js";

const router = express.Router();

router.get("/", getBoardingSequence);

export default router;
