import express from "express"
import cors from "cors"
import task from "./routes/task.js"
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())
app.use("/api/", task)
app.listen(port, console.log(`Server is up and running in PORT ${port}`))