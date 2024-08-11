import { MongoClient } from "mongodb"
import { User } from "./User.js"
import { createInterface } from "readline"
import { createReadStream } from "fs"
import dotenv from "dotenv"
import { Timer } from "./Timer.js"
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
    const readline = createInterface({
        input: createReadStream(`${process.env.USERS_DIR}/users.jsonl`),
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

    readline.close()
}

const timer = new Timer();

timer.start()
await bulkInsertUsers()
timer.end()
console.log("duration:", timer.getDuration())

client.close()