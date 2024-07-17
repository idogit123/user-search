import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { bulkInsert, getUsers } from "./client.js";
import { BulkInsertState } from "./BulkInsertState.js";
dotenv.config();
const PORT = process.env.API_PORT; // how to make it ready for production without ports ???
const app = express();
let bulkInsertState = new BulkInsertState();
app.use(express.json());
app.use(cors({
    origin: process.env.APP_ORIGIN
}));
app.get('/users/:page', async (req, res) => {
    const queryResult = await getUsers(req.query.query, req.query.sort, req.query.isDescending, parseInt(req.params.page));
    res.status(200).send(queryResult);
});
app.get('/insert', async (req, res) => {
    bulkInsertState.status = 'pending';
    res.status(200).send();
    bulkInsertState.duration = await bulkInsert();
    bulkInsertState.status = 'success';
});
app.get('/insert/status', async (req, res) => {
    res.status(200).send({ status: bulkInsertState.status, duration: bulkInsertState.duration });
    if (bulkInsertState.status == 'success')
        bulkInsertState.status = 'none';
});
app.listen(PORT, () => { console.log(`mongodb client listening on port: ${PORT}`); });
