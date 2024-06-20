import { DocumentStore, IAuthOptions } from "ravendb"
import { readFileSync } from "fs"
import dotenv from "dotenv"
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

export async function getTest()
{
    const session = documentStore.openSession()
    const test = await session.load("test")
    session.saveChanges()

    return test
}