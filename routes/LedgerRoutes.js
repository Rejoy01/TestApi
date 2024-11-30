import express from "express";
import { CreateLed, deleteUser, getAllUsers } from "../controller/LedController.js";

const router = express.Router()

router.post("/TestLED",CreateLed)
router.get("/GetAllLed",getAllUsers)
router.delete("/DeleteLed",deleteUser)
// without tally data



export {router as LedgerRoute}