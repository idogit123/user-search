import { DocumentStore } from "ravendb";
import { readFileSync } from "fs";
import { User } from "./User.js";
import dotenv from "dotenv";
dotenv.config(); // to access enviroment variables
const authOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH),
    type: "pfx",
    password: ""
};
const documentStore = new DocumentStore(process.env.SERVER_ADDRESS, process.env.DATABASE_NAME, authOptions);
documentStore.initialize();
generateUsers();
export async function getTest() {
    const session = documentStore.openSession();
    const test = await session.load("test");
    session.saveChanges();
    return test;
}
export async function generateUsers() {
    const users = [
        new User("Ido", "Vitman Zilber", "Binyamina"),
        new User("Uri", "Vitman Zilber", "Binyamina"),
        new User("Tamar", "Vitman Zilber", "Binyamina"),
        new User("Hana", "Vitman", "Hamadia"),
        new User("Ilana", "Zilber", "Tel-Aviv")
    ];
    const session = documentStore.openSession();
    users.forEach(async (user) => await session.store(user));
    await session.saveChanges();
    console.log("Users generated");
}
