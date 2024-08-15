import { DocumentStore } from "ravendb";
import dotenv from "dotenv";
import { User } from "./User.js";
import { createInterface } from "readline";
import { createReadStream } from 'fs';
import { Timer } from "./Timer.js";
dotenv.config();
const documentStore = new DocumentStore(process.env.SERVER_ADDRESS, process.env.DATABASE_NAME);
documentStore.initialize();
export async function bulkInsertUsers() {
    const readline = createInterface({
        input: createReadStream(`${process.env.USERS_DIR}/users.jsonl`),
        crlfDelay: Infinity
    });
    let counter = 0;
    let session = documentStore.openSession();
    for await (const line of readline) {
        const user = new User(JSON.parse(line));
        await session.store(user, user.getId(counter));
        if (counter % 1000 == 0) // save changes every 1000 users
         {
            await session.saveChanges();
            session = documentStore.openSession();
        }
        counter++;
    }
    readline.close();
}
const timer = new Timer();
timer.start();
await bulkInsertUsers();
timer.end();
console.log("duration: " + timer.getDuration());
documentStore.dispose();
