import { DocumentStore, IAuthOptions } from "ravendb"
import { readFileSync } from "fs"
import dotenv from "dotenv"
import { User } from "./User.js"
import { createInterface } from "readline"
import { createReadStream, readdirSync } from 'fs'
import { Timer } from "./Timer.js"
dotenv.config()

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
    const userFiles = readdirSync(process.env.USERS_DIR as string)

    for (const userFilePath of userFiles)
    {
        const bulkInsert = documentStore.bulkInsert()
        const readline = createInterface({
            input: createReadStream(`${process.env.USERS_DIR}/${userFilePath}`),
            crlfDelay: Infinity
        })

        for await (const line of readline)
        {
            const user = new User(JSON.parse(line))
            await bulkInsert.store(user)
        }
        
        readline.close()
        await bulkInsert.finish()
        console.log('FINISHED Inserting file: ', userFilePath)
    }
}

const timer = new Timer()

timer.start()
await bulkInsertUsers()
timer.end()
console.log("Bulk Insert Took: " + timer.getDuration())

documentStore.dispose()