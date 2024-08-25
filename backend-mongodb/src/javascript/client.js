import { MongoClient } from "mongodb";
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
