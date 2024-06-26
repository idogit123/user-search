import { DocumentStore, QueryStatistics } from "ravendb";
import { readFileSync, createReadStream } from "fs";
import dotenv from "dotenv";
import { User } from "./User.js";
import { Timer } from "./Timer.js";
import ReadLine from "readline";
dotenv.config(); // to access enviroment variables
const authOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH),
    type: "pfx",
    password: ""
};
const documentStore = new DocumentStore(process.env.SERVER_ADDRESS, process.env.DATABASE_NAME, authOptions);
documentStore.initialize();
const timer = new Timer();
bulkInsertUsers('C:/Users/Ido Vitman Zilber/Documents/GitHub/user-search/user-generator/users.jsonl');
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
        usersQuery = session.query(User);
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
export async function bulkInsertUsers(filePath) {
    const reader = ReadLine.createInterface({
        input: createReadStream(filePath),
    });
    reader.on('line', function (line) {
        const json = JSON.parse(line);
        console.log(json);
    });
    reader.on('close', function () {
        console.log('all done, son');
    });
}
