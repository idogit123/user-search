import { MongoClient } from "mongodb"
import { User } from "./User"
import dotenv from "dotenv"
dotenv.config()

const databaseInfo = {
    serverPath:  process.env.SERVER_PATH  as string,
    databaseName:   process.env.DATABASE_NAME   as string,
    collectionName: process.env.COLLECTION_NAME as string
}

const client = new MongoClient( databaseInfo.serverPath )
const usersDB = client.db( databaseInfo.databaseName )

export async function getUsers(query: string) {
    const usersCollection = usersDB.collection<User>( databaseInfo.collectionName )

    const usersQuery = usersCollection.find<User>(
        {
            $or: [
                { 'firstName': { $regex: new RegExp("^" + query, "i") } },
                { 'lastName': { $regex: new RegExp("^" + query, "i") } },
                { 'city': { $regex: new RegExp("^" + query, "i") } }
            ]
        }
    )
    
    const users = await usersQuery.toArray()
    const stats = await usersQuery.explain("executionStats")
    
    return {
        users: users,
        durationInMs: stats.executionStats.executionStages.executionTimeMillisEstimate
    }
}