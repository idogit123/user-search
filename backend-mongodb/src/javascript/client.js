import { MongoClient } from "mongodb";
import { User } from "./User.js";
import { Timer } from "./Timer.js";
import dotenv from "dotenv";
import { createReadStream, readdirSync } from "fs";
import { createInterface } from "readline";
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
        'firstName': { $regex: new RegExp("^" + query, "i") }
    })
        .sort(sort, isDescending ? -1 : 1)
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
        let lastTask = new Promise((resolve, reject) => resolve(1));
        for await (const line of readline) {
            const user = new User(JSON.parse(line));
            batch.push(user);
            if (batch.length >= MAX_BATCH_SIZE) {
                await lastTask;
                lastTask = usersCollection.insertMany(batch);
                batch = [];
            }
        }
        await lastTask;
        // insert remaining users
        if (batch.length > 0) {
            await usersCollection.insertMany(batch);
        }
        console.log('inserted file: ', userFilePath);
        readline.close();
    }
    timer.end();
    return timer.getDuration();
}
