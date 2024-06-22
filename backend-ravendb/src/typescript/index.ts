import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { getUsers } from "./client.js"
dotenv.config()

const PORT = process.env.API_PORT as string // how to make it ready for production without ports ???
const app = express()

app.use( express.json() )
app.use(
    cors({
        origin: process.env.APP_ORIGIN
    })
)

app.get('/users', async (req, res) => {
    const queryResult = await getUsers(req.query.query as string)
    
    res.status(200).send(
        queryResult
    )
})

app.listen(
    PORT,
    () => { console.log(`listening on port: ${PORT}`) }
)