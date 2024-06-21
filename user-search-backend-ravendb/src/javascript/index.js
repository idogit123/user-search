import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getUsers } from "./client.js";
dotenv.config();
const PORT = process.env.API_PORT; // how to make it ready for production without ports ???
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.APP_ORIGIN
}));
app.get('/users', async (req, res) => {
    console.log('fetched users');
    const users = await getUsers(req.query.query);
    users.forEach((user) => console.log(user.firstName));
    res.status(200).send(users);
});
app.listen(PORT, () => { console.log(`listening on port: ${PORT}`); });
