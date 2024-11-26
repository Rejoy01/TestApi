import express from 'express'
import { ConnectTally } from '../TallyDB/TallyConnection.js'

const router = express.Router()

router.post('/connectTally',ConnectTally)

export { router as TallyDbConnection }