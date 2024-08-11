import { MongoClient } from "mongodb"
import { User } from "./User.js"
import { createInterface } from "readline"
import { createReadStream, readdirSync } from "fs"
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

export async function bulkInsertUsers()
{
    const userFiles = readdirSync(process.env.USERS_DIR as string)

    for await (const userFilePath of userFiles)
    {
        const readline = createInterface({
            input: createReadStream(`${process.env.USERS_DIR}/${userFilePath}`),
            crlfDelay: Infinity
        })

        for await (const line of readline)
        {
            const user = new User(JSON.parse(line))
            await usersCollection.insertOne(user)
        }

        console.log('FINISHED Inserting file: ', userFilePath)
        readline.close()
    }
}

await bulkInsertUsers()

client.close()