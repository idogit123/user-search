import { MongoClient } from "mongodb"
import { User } from "./User.js"
import { Timer } from "./Timer.js"
import dotenv from "dotenv"
dotenv.config()

const databaseInfo = {
    serverPath:  process.env.SERVER_PATH  as string,
    databaseName:   process.env.DATABASE_NAME   as string,
    collectionName: process.env.COLLECTION_NAME as string
}

const client = new MongoClient( databaseInfo.serverPath )
const usersDB = client.db( databaseInfo.databaseName )
const usersCollection = usersDB.collection<User>( databaseInfo.collectionName )
const timer = new Timer()

export async function getUsers(query: string, sort: string, isDescending: string, page: number) {
    const PAGE_SIZE = 10
    const usersQuery = usersCollection.find<User>(
        {
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
        .limit(PAGE_SIZE)
    
    timer.start()
    const users = await usersQuery.toArray()
    timer.end()
    
    return {
        users: users,
        durationInMs: timer.getDuration()
    }
}