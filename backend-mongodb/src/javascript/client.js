import { MongoClient } from "mongodb";
import { User } from "./User.js";
import { createInterface } from "readline";
import { createReadStream, readdirSync } from "fs";
import { Timer } from "./Timer.js";
import dotenv from "dotenv";
dotenv.config();
const databaseInfo = {
    serverPath: process.env.SERVER_PATH,
    databaseName: process.env.DATABASE_NAME,
    collectionName: process.env.COLLECTION_NAME
};
const client = new MongoClient(databaseInfo.serverPath);
const usersDB = client.db(databaseInfo.databaseName);
const usersCollection = usersDB.collection(databaseInfo.collectionName);
const timer = new Timer();
export async function getUsers(query, sort, isDescending, page) {
    const PAGE_SIZE = 10;
    const usersQuery = usersCollection.find({
        $or: [
            { 'firstName': { $regex: new RegExp("^" + query, "i") } },
            { 'lastName': { $regex: new RegExp("^" + query, "i") } },
            { 'address.city': { $regex: new RegExp("^" + query, "i") } },
            { 'contact.instegram': { $regex: new RegExp("^" + query, "i") } },
            { 'job.title': { $regex: new RegExp("^" + query, "i") } }
        ],
    })
        .sort(sort, isDescending == "true" ? -1 : 1)
        .skip(PAGE_SIZE * page)
        .limit(PAGE_SIZE);
    timer.start();
    const users = await usersQuery.toArray();
    timer.end();
    return {
        users: users,
        durationInMs: timer.getDuration()
    };
}
export async function bulkInsert() {
    const userFiles = readdirSync(process.env.USERS_DIR);
    timer.start();
    for await (const userFilePath of userFiles) {
        const readline = createInterface({
            input: createReadStream(`${process.env.USERS_DIR}/${userFilePath}`),
            crlfDelay: Infinity
        });
        const MAX_BATCH_SIZE = 1000;
        let batch = [];
        for await (const line of readline) {
            const user = new User(JSON.parse(line));
            batch.push(user);
            if (batch.length >= MAX_BATCH_SIZE) {
                await usersCollection.insertMany(batch);
                console.log(`inserted batch, size: ${batch.length}`);
                batch = [];
            }
        }
        // insert remaining users
        if (batch.length > 0) {
            await usersCollection.insertMany(batch);
            console.log(`insert remaining users, size: ${batch.length}`);
        }
        readline.close();
    }
    timer.end();
    return timer.getDuration();
}
