import { DocumentStore } from "ravendb";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import { Timer } from "./Timer.js";
dotenv.config(); // to access enviroment variables
const PAGE_SIZE = 10;
const authOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH),
    type: "pfx",
    password: ""
};
const documentStore = new DocumentStore(process.env.SERVER_ADDRESS, process.env.DATABASE_NAME, authOptions);
documentStore.initialize();
const timer = new Timer();
export async function getUsers(query, sort, isDescending, page) {
    const session = documentStore.openSession();
    let usersQuery = session.query({ collection: 'users' })
        .addOrder(sort, isDescending == "true")
        .skip(PAGE_SIZE * page)
        .take(PAGE_SIZE);
    if (query.length > 0)
        usersQuery
            .whereStartsWith('firstName', query);
    timer.start();
    const users = await usersQuery.all();
    timer.end();
    return {
        users: users,
        durationInMs: timer.getDuration()
    };
}
