import { DocumentStore, IAuthOptions, IMetadataDictionary } from "ravendb"
import { readFileSync } from "fs"
import dotenv from "dotenv"
import { User } from "./User.js"
import { createInterface } from "readline"
import { createReadStream, readdirSync } from 'fs'
import { Timer } from "./Timer.js"
dotenv.config() // to access enviroment variables

const authOptions: IAuthOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH as string),
    type: "pfx",
    password: ""
}

const documentStore = new DocumentStore(
    process.env.SERVER_ADDRESS as string,
    process.env.DATABASE_NAME as string, 
    authOptions
)
documentStore.initialize()

export async function bulkInsertUsers()
{
    const bulkInsert = documentStore.bulkInsert()
    const readline = createInterface({
        input: createReadStream(`${process.env.USERS_DIR}/users.jsonl`),
        crlfDelay: Infinity
    })

    const metadata = { "@collection": "Users" } as IMetadataDictionary;
    let userCounter = 0
    for await (const line of readline)
    {
        const user = new User(JSON.parse(line))
        const id = user.getId(userCounter)
        if (!bulkInsert.tryStoreSync(user, id, metadata)) 
        {
            await bulkInsert.store(user, id, metadata)
        }

        userCounter++
    }

    readline.close()
    await bulkInsert.finish()
}

const timer = new Timer();

timer.start()
await bulkInsertUsers()
timer.end()
console.log("duration:", timer.getDuration());

documentStore.dispose()