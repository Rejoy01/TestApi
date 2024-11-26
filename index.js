import express from "express";
import  dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors'
import { LedgerRoute } from "./routes/LedgerRoutes.js";
import { TallyDbConnection } from "./routes/TallyDbConnection.js";
import connectionDB from "./routes/MydatabaseConn.js";

dotenv.config()


const PORT = process.env.PORT || 3000

const App = express()

App.use(express.json())
App.use(cookieParser())
App.use(cors())

App.use('/api/',LedgerRoute)
App.use('/api/tally/',TallyDbConnection)

// App.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`)
// })

App.listen(PORT,connectionDB())