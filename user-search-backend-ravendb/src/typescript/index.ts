import express from "express"
import dotenv from "dotenv"
import { getTest } from "./client.js"
dotenv.config()

const PORT = process.env.API_PORT as string // how to make it ready for production without ports ???
const app = express()

app.use( express.json() )

app.get('/test', async (req, res) => {
    console.log(req.query.query)

    res.status(200).send(
        await getTest()
    )
})

app.listen(
    PORT,
    () => { console.log(`listening on port: ${PORT}`) }
)