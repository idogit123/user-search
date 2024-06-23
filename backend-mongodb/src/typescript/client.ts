import { MongoClient } from "mongodb"
import { User } from "./User"
import dotenv from "dotenv"
dotenv.config()

const databaseInfo = {
    serverPath:  process.env.SERVER_PATH  as string,
    databaseName:   process.env.DATABASE_NAME   as string,
    collectionName: process.env.COLLECTION_NAME as string
}

export async function getUsers(query: string) {
    const client = new MongoClient( databaseInfo.serverPath )
    const usersDB = client.db( databaseInfo.databaseName )
    const usersCollection = usersDB.collection<User>( databaseInfo.collectionName )

    const matchingUsers = await usersCollection.find<User>(
        { 
            firstName: { $regex: new RegExp("^" + query + ".*", "i") } 
        }
    ).toArray()
    
    client.close()

    return {
        users: matchingUsers,
        durationInMs: 123 // place-holder value
    }
}