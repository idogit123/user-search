import { MongoClient } from "mongodb";
import { User } from "./User.js";
import { createInterface } from "readline";
import { createReadStream } from "fs";
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
            { 'city': { $regex: new RegExp("^" + query, "i") } }
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
    const readline = createInterface({
        input: createReadStream('C:/Users/Ido Vitman Zilber/Documents/GitHub/user-search/user-generator/users1.jsonl'),
        crlfDelay: Infinity
    });
    timer.start();
    for await (const line of readline) {
        const user = JSON.parse(line);
        await usersCollection.insertOne(new User(user));
    }
    timer.end();
    console.log(await usersCollection.estimatedDocumentCount());
    return timer.getDuration();
}
