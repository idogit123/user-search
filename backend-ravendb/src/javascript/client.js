import { DocumentStore, QueryStatistics } from "ravendb";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import { User } from "./User.js";
import { Timer } from "./Timer.js";
import { StreamLineReader } from "./StreamLineReader.js";
dotenv.config(); // to access enviroment variables
const authOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH),
    type: "pfx",
    password: ""
};
const documentStore = new DocumentStore(process.env.SERVER_ADDRESS, process.env.DATABASE_NAME, authOptions);
documentStore.initialize();
const timer = new Timer();
export async function getUsers(query, sort, isDescending) {
    let queryStats = new QueryStatistics();
    const session = documentStore.openSession();
    let usersQuery;
    if (query.length > 0)
        usersQuery = session.query(User)
            .whereStartsWith('firstName', query)
            .orElse()
            .whereStartsWith('lastName', query)
            .orElse()
            .whereStartsWith('city', query)
            .statistics(stats => queryStats = stats);
    else
        usersQuery = session.query(User)
            .statistics(stats => queryStats = stats);
    if (isDescending == "true")
        usersQuery.orderByDescending(sort);
    else
        usersQuery.orderBy(sort);
    timer.start();
    const users = await usersQuery.all();
    timer.end();
    return {
        users: users,
        durationInMs: timer.getDuration()
    };
}
export async function bulkInsertUsers(callback) {
    // const reader = createInterface({
    //     input: createReadStream(
    //         'C:/Users/Ido Vitman Zilber/Documents/GitHub/user-search/user-generator/users.jsonl'
    //     ),
    // });
    // reader.on('line', async (line: string) => {
    //     const user = JSON.parse(line)
    //     await bulkInsert.store(user)
    // });
    // reader.on('close', async () => {
    //     timer.start()
    //     await bulkInsert.finish()
    //     timer.end()
    //     callback(timer.getDuration())
    // });
    const reader = new StreamLineReader('C:/Users/Ido Vitman Zilber/Documents/GitHub/user-search/user-generator/users.jsonl');
    reader.readLinesSync(async (line, bulkInsert) => {
        const user = JSON.parse(line);
        await bulkInsert.store(user, User.createUserId(user.firstName, user.lastName), {
            isDirty: () => false,
            '@collection': 'Users'
        });
    }, async () => {
        return documentStore.bulkInsert();
    }, async (bulkInsert, linesProcessed) => {
        await waitForBulkInsert(bulkInsert, linesProcessed);
        await bulkInsert.finish();
    }, async (linesProcessed) => {
        callback(linesProcessed);
    });
}
function waitForBulkInsert(bulkInsert, linesProcessed) {
    return new Promise(async (resolve, reject) => {
        bulkInsert.on('progress', (stats) => {
            console.log('Lines processed: ', linesProcessed);
            console.log('Users stored: ', stats.progress.documentsProcessed);
            if (stats.progress.documentsProcessed == linesProcessed) {
                resolve(stats.progress.documentsProcessed);
            }
        });
    });
}
