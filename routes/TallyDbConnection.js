import express from 'express'
import { ConnectTally, GetAllLedgers, connectToTally, getAllLedgers } from '../TallyDB/TallyConnection.js'

const router = express.Router()

router.post('/connectTally',ConnectTally)
router.get('/GetTallyData',connectToTally)

export { router as TallyDbConnection }