import { DocumentStore } from "ravendb";
import { readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config(); // to access enviroment variables
const authOptions = {
    certificate: readFileSync(process.env.CERTIFICATE_PATH),
    type: "pfx",
    password: ""
};
const documentStore = new DocumentStore("https://a.idovz.ravendb.community", "Users", authOptions);
documentStore.initialize();
const session = documentStore.openSession();
const test = (await session.load("test"));
console.log(test.test);
session.saveChanges();
