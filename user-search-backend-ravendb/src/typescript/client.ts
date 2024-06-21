import { DocumentStore, IAuthOptions } from "ravendb"
import { readFileSync } from "fs"
import dotenv from "dotenv"
import { User } from "./User.js"
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

export async function getUsers(query: string)
{
    const session = documentStore.openSession()
    const users = await session.query<User>(User)
        .search('firstName', query + '*')
        .all()
        
    session.saveChanges()

    return users
}