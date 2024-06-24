import { DocumentStore, IAuthOptions, IDocumentQuery, QueryStatistics } from "ravendb"
import { readFileSync } from "fs"
import dotenv from "dotenv"
import { User } from "./User.js"
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

export async function getUsers(query: string, sort: string)
{
    let queryStats: QueryStatistics = new QueryStatistics()

    const session = documentStore.openSession()

    let usersQuery: IDocumentQuery<User>
    if (query.length > 0)
        usersQuery = session.query<User>(User)
            .whereStartsWith('firstName', query)
            .orElse()
            .whereStartsWith('lastName', query)
            .orElse()
            .whereStartsWith('city', query)
            .statistics( stats => queryStats = stats )
            .orderBy(sort)
    else 
        usersQuery = session.query<User>(User)
            .orderBy(sort)
        
    timer.start()
    const users = await usersQuery.all()
    timer.end()

    return {
        users: users,
        durationInMs: timer.getDuration()
    }
}