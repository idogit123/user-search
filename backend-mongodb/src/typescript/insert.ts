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

        const MAX_BATCH_SIZE = 1000
        let batch: User[] = []

        for await (const line of readline)
        {
            const user = new User(JSON.parse(line))
            batch.push(user)

            if (batch.length >= MAX_BATCH_SIZE)
            {
                await usersCollection.insertMany(batch)
                batch = []
            }
        }

        // insert remaining users
        if (batch.length > 0)
        {
            await usersCollection.insertMany(batch)
            console.log(`insert remaining users, size: ${batch.length}`)
        }

        console.log('insered file: ', userFilePath)
        readline.close()
    }
}

await bulkInsertUsers()

client.close()