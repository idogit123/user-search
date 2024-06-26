import { DocumentStore, IAuthOptions, IDocumentQuery, QueryStatistics } from "ravendb"
import { readFileSync, createReadStream } from "fs"
import dotenv from "dotenv"
import { User } from "./User.js"
import { Timer } from "./Timer.js"
import { createInterface } from "readline";

import StreamArray from 'stream-json/streamers/StreamArray.js'
import Stream from 'stream-json/Parser.js'
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

export async function bulkInsertUsers(filePath: string)
{
    const bulkInsert = documentStore.bulkInsert()
    const reader = createInterface({
        input: createReadStream(filePath),
    });
    
    reader.on('line', async (line: string) => {
        const user = JSON.parse(line)
        await bulkInsert.store(user)
    });

    reader.on('close', async () => {
        await bulkInsert.finish()
    });
}

