import { DocumentStore, QueryStatistics } from "ravendb";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import { User } from "./User.js";
dotenv.config(); // to access enviroment variables
const authOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH),
    type: "pfx",
    password: ""
};
const documentStore = new DocumentStore(process.env.SERVER_ADDRESS, process.env.DATABASE_NAME, authOptions);
documentStore.initialize();
export async function getUsers(query) {
    let queryStats = new QueryStatistics();
    const session = documentStore.openSession();
    const users = await session.query(User)
        .whereStartsWith('firstName', query)
        .orElse()
        .whereStartsWith('lastName', query)
        .orElse()
        .whereStartsWith('city', query)
        .statistics(stats => queryStats = stats)
        .all();
    return {
        users: users,
        durationInMs: queryStats.durationInMs
    };
}
