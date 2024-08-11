import { DocumentStore, IAuthOptions, IMetadataDictionary } from "ravendb"
import { readFileSync } from "fs"
import dotenv from "dotenv"
import { User } from "./User.js"
import { createInterface } from "readline"
import { createReadStream, readdirSync } from 'fs'
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
    const userFiles = readdirSync(process.env.USERS_DIR as string)

    for (const userFilePath of userFiles)
    {
        const bulkInsert = documentStore.bulkInsert()
        const readline = createInterface({
            input: createReadStream(`${process.env.USERS_DIR}/${userFilePath}`),
            crlfDelay: Infinity
        })

        const metadata = { "@collection": "Users" } as IMetadataDictionary;
        for await (const line of readline)
        {
            const user = new User(JSON.parse(line))
            const id = user.getId()
            if (!bulkInsert.tryStoreSync(user, id, metadata)) {
                await bulkInsert.store(user, id, metadata)
            }
        }
        
        readline.close()
        await bulkInsert.finish()
        console.log('FINISHED Inserting file: ', userFilePath)
    }
}

await bulkInsertUsers()

documentStore.dispose()