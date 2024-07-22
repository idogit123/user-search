import { MongoClient } from "mongodb"
import { User } from "./User.js"
import { Timer } from "./Timer.js"
import dotenv from "dotenv"
import { createReadStream, readdirSync } from "fs"
import { createInterface } from "readline"
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

export async function getUsers(query: string, sort: string, isDescending: boolean, page: number) {
    const PAGE_SIZE = 10
    const usersQuery = usersCollection.find<User>(
        {
            'firstName': { $regex: new RegExp("^" + query, "i") }
        })
        .sort(sort, isDescending ? -1 : 1)
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

export async function bulkInsert()
{
    const userFiles = readdirSync(process.env.USERS_DIR as string)

    timer.start()
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
    timer.end()

    return timer.getDuration()
}