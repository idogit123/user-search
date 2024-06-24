import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const databaseInfo = {
    serverPath: process.env.SERVER_PATH,
    databaseName: process.env.DATABASE_NAME,
    collectionName: process.env.COLLECTION_NAME
};
const client = new MongoClient(databaseInfo.serverPath);
const usersDB = client.db(databaseInfo.databaseName);
export async function getUsers(query) {
    const usersCollection = usersDB.collection(databaseInfo.collectionName);
    const usersQuery = usersCollection.find({
        $or: [
            { 'firstName': { $regex: new RegExp("^" + query, "i") } },
            { 'lastName': { $regex: new RegExp("^" + query, "i") } },
            { 'city': { $regex: new RegExp("^" + query, "i") } }
        ]
    });
    const users = await usersQuery.toArray();
    const stats = await usersQuery.explain("executionStats");
    return {
        users: users,
        durationInMs: stats.executionStats.executionStages.executionTimeMillisEstimate
    };
}
