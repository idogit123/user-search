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

async function bulkInsertUsers()
{
    const readline = createInterface({
        input: createReadStream(`${process.env.USERS_DIR}/users.jsonl`),
        crlfDelay: Infinity
    })

    let counter = 0
    
    for await (const line of readline)
    {
        const user = new User(JSON.parse(line))
        
        const session = documentStore.openSession()
        await session.store<User>(user, user.getId(counter))
        await session.saveChanges()
        
        counter++
    }

    readline.close()
}

const timer = new Timer()

timer.start()
await bulkInsertUsers()
timer.end()
console.log("duration: " + timer.getDuration())

documentStore.dispose()