import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { getUsers } from "./client.js";
dotenv.config();
const PORT = process.env.API_PORT; // how to make it ready for production without ports ???
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.APP_ORIGIN
}));
app.get('/users/:page', async (req, res) => {
    const queryResult = await getUsers(req.query.query, req.query.sort, req.query.isDescending == "true", parseInt(req.params.page));
    res.status(200).send(queryResult);
});
app.listen(PORT, () => { console.log(`mongodb client listening on port: ${PORT}`); });
