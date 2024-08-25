import { DocumentStore } from "ravendb";
import { readFileSync, createReadStream, read } from "fs";
import dotenv from "dotenv";
import { User } from "./User.js";
import { createInterface } from "readline";

dotenv.config(); // to access enviroment variables
const authOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH),
    type: "pfx",
    password: ""
};

const documentStore = new DocumentStore(process.env.RAVENDB_SERVER, process.env.DATABASE_NAME, authOptions);
documentStore.initialize();

export async function bulkInsertUsers(path) {
    const bulkInsert = documentStore.bulkInsert();
    const readline = createInterface({
        input: createReadStream(path),
        crlfDelay: Infinity
    });

    for await (const line of readline) {
        const user = new User(JSON.parse(line));
        await bulkInsert.store(user);
    }

    readline.close()
    await bulkInsert.finish();
    documentStore.dispose()
}