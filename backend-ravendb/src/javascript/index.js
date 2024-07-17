import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { bulkInsertUsers, getUsers } from "./client.js";
import { BulkInsertState } from "./BulkInsertState.js";
dotenv.config();
const PORT = process.env.API_PORT; // how to make it ready for production without ports ???
const app = express();
let bulkInsertStatus = new BulkInsertState();
app.use(express.json());
app.use(cors({
    origin: process.env.APP_ORIGIN
}));
app.get('/users/:page', async (req, res) => {
    const queryResult = await getUsers(req.query.query, req.query.sort, req.query.isDescending, parseInt(req.params.page));
    res.status(200).send(queryResult);
});
app.get('/insert', async (req, res) => {
    bulkInsertStatus.status = 'pending';
    res.status(200).send({ bulkInsert: 'pending' });
    bulkInsertStatus.duration = await bulkInsertUsers();
    bulkInsertStatus.status = 'success';
});
app.get('/insert/status', async (req, res) => {
    res.status(200).send({ status: bulkInsertStatus.status, duration: bulkInsertStatus.duration });
    if (bulkInsertStatus.status == 'success')
        bulkInsertStatus.status = 'none';
});
app.listen(PORT, () => { console.log(`ravendb client  listening on port: ${PORT}`); });
