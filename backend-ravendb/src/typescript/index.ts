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
        origin: "*"
    })
)

app.get('/users/:page', async (req, res) => {
    const queryResult = await getUsers(
        req.query.query as string, 
        req.query.sort as string,
        req.query.isDescending as string == "true",
        parseInt(req.params.page)
    )

    res.status(200).send(
        queryResult
    )
})

app.listen(
    PORT,
    () => { console.log(`ravendb client  listening on port: ${PORT}`) }
)