import express from "express";
import { CreateLed } from "../controller/LedController.js";

const router = express.Router()

router.post("/TestLED",CreateLed)

export {router as LedgerRoute}