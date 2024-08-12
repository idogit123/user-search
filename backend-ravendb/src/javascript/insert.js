import { DocumentStore } from "ravendb";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import { createInterface } from "readline";
import { createReadStream } from 'fs';
import { Timer } from "./Timer.js";
dotenv.config(); // to access enviroment variables
const authOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH),
    type: "pfx",
    password: ""
};
const documentStore = new DocumentStore(process.env.SERVER_ADDRESS, process.env.DATABASE_NAME, authOptions);
documentStore.initialize();
export async function bulkInsertUsers() {
    const bulkInsert = documentStore.bulkInsert();
    const readline = createInterface({
        input: createReadStream(`${process.env.USERS_DIR}/users.jsonl`),
        crlfDelay: Infinity
    });
    const metadata = { "@collection": "Users", "Raven-Node-Type": "User" };
    let userCounter = 0;
    for await (const line of readline) {
        const user = JSON.parse(line);
        const id = "users/" + (userCounter).toString().padStart(8, '0');
        if (!bulkInsert.tryStoreSync(user, id, metadata)) {
            await bulkInsert.store(user, id, metadata);
        }
        userCounter++;
    }
    readline.close();
    await bulkInsert.finish();
}
const timer = new Timer();
timer.start();
await bulkInsertUsers();
timer.end();
console.log("duration:", timer.getDuration());
documentStore.dispose();
