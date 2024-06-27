import { DocumentStore, IAuthOptions, IDocumentQuery, QueryStatistics } from "ravendb"
import { readFileSync } from "fs"
import dotenv from "dotenv"
import { User } from "./User.js"
import { Timer } from "./Timer.js"
import { createInterface } from "readline"
import { createReadStream } from 'fs'

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

export async function getUsers(query: string, sort: string, isDescending: string)
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

    else 
        usersQuery = session.query<User>(User)
            .statistics( stats => queryStats = stats )

    if (isDescending == "true")
        usersQuery.orderByDescending(sort)
    else 
        usersQuery.orderBy(sort)
        
    timer.start()
    const users = await usersQuery.all()
    timer.end()

    return {
        users: users,
        durationInMs: timer.getDuration()
    }
}

export async function bulkInsertUsers()
{
    const bulkInsert = documentStore.bulkInsert()
    const readline = createInterface({
        input: createReadStream('C:/Users/Ido Vitman Zilber/Documents/GitHub/user-search/user-generator/users1.jsonl'),
        crlfDelay: Infinity
    })

    timer.start()
    for await (const line of readline)
    {
        const user = JSON.parse(line)
        await bulkInsert.store(new User(user))
    }

    await bulkInsert.finish()
    timer.end()

    return timer.getDuration()
}
