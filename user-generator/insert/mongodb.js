import { MongoClient } from "mongodb";
import { User } from "./User.js";
import { createInterface } from "readline";
import { createReadStream } from "fs";
import dotenv from "dotenv";

dotenv.config();
const databaseInfo = {
    serverPath: process.env.MONGODB_SERVER,
    databaseName: process.env.DATABASE_NAME,
    collectionName: process.env.COLLECTION_NAME
};
const client = new MongoClient(databaseInfo.serverPath);
const usersDB = client.db(databaseInfo.databaseName);
const usersCollection = usersDB.collection(databaseInfo.collectionName);

export async function bulkInsertUsers(path) {
    const readline = createInterface({
        input: createReadStream(path),
        crlfDelay: Infinity
    });

    for await (const line of readline) {
        const user = JSON.parse(line);
        await usersCollection.insertOne(new User(user));
    }

    readline.close()
    await client.close()
}
