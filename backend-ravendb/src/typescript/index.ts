import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { bulkInsertUsers, getUsers } from "./client.js"
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
    const queryResult = await getUsers(
        req.query.query as string, 
        req.query.sort as string,
        req.query.isDescending as string
    )
    
    res.status(200).send(
        queryResult
    )
})

app.get('/insert', async (req, res) => {
    bulkInsertUsers(
        (durationInMs: number) => {
            res.status(200).send({ durationInMs: durationInMs })
        }
    )
})

app.listen(
    PORT,
    () => { console.log(`ravendb client  listening on port: ${PORT}`) }
)