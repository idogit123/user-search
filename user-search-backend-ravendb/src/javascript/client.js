import { DocumentStore } from "ravendb";
import { readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config(); // to access enviroment variables
const authOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH),
    type: "pfx",
    password: ""
};
const documentStore = new DocumentStore(process.env.SERVER_ADDRESS, process.env.DATABASE_NAME, authOptions);
documentStore.initialize();
export async function getTest() {
    const session = documentStore.openSession();
    const test = await session.load("test");
    session.saveChanges();
    return test;
}
