import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { Timer } from "./Timer.js";
dotenv.config();
const databaseInfo = {
    serverPath: process.env.SERVER_PATH,
    databaseName: process.env.DATABASE_NAME,
    collectionName: process.env.COLLECTION_NAME
};
const client = new MongoClient(databaseInfo.serverPath);
const usersDB = client.db(databaseInfo.databaseName);
const timer = new Timer();
export async function getUsers(query, sort, isDescending) {
    const usersCollection = usersDB.collection(databaseInfo.collectionName);
    const usersQuery = usersCollection.find({
        $or: [
            { 'firstName': { $regex: new RegExp("^" + query, "i") } },
            { 'lastName': { $regex: new RegExp("^" + query, "i") } },
            { 'city': { $regex: new RegExp("^" + query, "i") } }
        ]
    }).sort(sort, isDescending == "true" ? -1 : 1);
    timer.start();
    const users = await usersQuery.toArray();
    timer.end();
    return {
        users: users,
        durationInMs: timer.getDuration()
    };
}
