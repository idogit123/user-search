import { DocumentStore, IAuthOptions } from "ravendb"
import { readFileSync } from "fs"
import dotenv from "dotenv"
import { User } from "./User.js"
import { Timer } from "./Timer.js"
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
            .orElse()
            .whereStartsWith('lastName', query)
            .orElse()
            .whereStartsWith('address.city', query)
            .orElse()
            .whereStartsWith('contact.instegram', query)
            .orElse()
            .whereStartsWith('job.title', query)
        
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
    const userFiles = readdirSync(process.env.USERS_DIR as string)

    var tasks = [];
    timer.start()
    for (const userFilePath of userFiles)
    {
        tasks.push(bulkInsertFile(userFilePath));
    }
    await Promise.all(tasks);
    timer.end()

    return timer.getDuration()

    async function bulkInsertFile(userFilePath: string) {
        const bulkInsert = documentStore.bulkInsert()
        const readline = createInterface({
            input: createReadStream(`${process.env.USERS_DIR}/${userFilePath}`),
            crlfDelay: Infinity
        })

        for await (const line of readline) {
            const user = new User(JSON.parse(line))
            await bulkInsert.store(user)
        }

        readline.close()
        await bulkInsert.finish()
        console.log('FINISHED Inserting file: ', userFilePath)
    }
}
