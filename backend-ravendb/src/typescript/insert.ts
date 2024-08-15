import { DocumentStore } from "ravendb"
import dotenv from "dotenv"
import { User } from "./User.js"
import { createInterface } from "readline"
import { createReadStream } from 'fs'
import { Timer } from "./Timer.js"
dotenv.config()

const documentStore = new DocumentStore(
    process.env.SERVER_ADDRESS as string,
    process.env.DATABASE_NAME as string, 
)
documentStore.initialize()

export async function bulkInsertUsers()
{
    const session = documentStore.openSession()
    const readline = createInterface({
        input: createReadStream(`${process.env.USERS_DIR}/users.jsonl`),
        crlfDelay: Infinity
    })

    for await (const line of readline)
    {
        const user = new User(JSON.parse(line))
        await session.store(user)
    }
    
    readline.close()
    await session.saveChanges()
}

const timer = new Timer()

timer.start()
await bulkInsertUsers()
timer.end()
console.log("duration: " + timer.getDuration())

documentStore.dispose()