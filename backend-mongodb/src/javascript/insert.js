import { MongoClient } from "mongodb";
import { User } from "./User.js";
import { createInterface } from "readline";
import { createReadStream, readdirSync } from "fs";
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
export async function bulkInsertUsers() {
    const userFiles = readdirSync(process.env.USERS_DIR);
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
                await usersCollection.insertMany(batch, { writeConcern: { j: true } });
                batch = [];
            }
        }
        // insert remaining users
        if (batch.length > 0) {
            await usersCollection.insertMany(batch);
            console.log(`insert remaining users, size: ${batch.length}`);
        }
        console.log('insered file: ', userFilePath);
        readline.close();
    }
}
let start = new Date();
await bulkInsertUsers();
const duration = new Date().getTime() - start.getTime();
console.log("duration", duration);
client.close();
