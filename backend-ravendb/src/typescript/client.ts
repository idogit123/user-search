import { DocumentStore, IAuthOptions } from "ravendb"
import { readFileSync } from "fs"
import dotenv from "dotenv"
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

const timer = new Timer()

export async function getUsers(query: string, sort: string, isDescending: boolean, page: number)
{
    const PAGE_SIZE = 10
    const session = documentStore.openSession()

    let usersQuery = session.query({ collection: 'users' })
        .addOrder(sort, isDescending)
        .skip(PAGE_SIZE * page)
        .take(PAGE_SIZE)

    if (query.length > 0)
        usersQuery
            .whereStartsWith('firstName', query)
        
    timer.start()
    const users = await usersQuery.all()
    timer.end()

    return {
        users: users,
        durationInMs: timer.getDuration()
    }
}