import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const databaseInfo = {
    serverPath: process.env.SERVER_PATH,
    databaseName: process.env.DATABASE_NAME,
    collectionName: process.env.COLLECTION_NAME
};
async function testMongoDB() {
    console.log(databaseInfo);
    const client = new MongoClient(databaseInfo.serverPath);
    const usersDB = client.db(databaseInfo.databaseName);
    const users = usersDB.collection(databaseInfo.collectionName);
    const test = await users.findOne({ test: true });
    console.log(test?.test);
    client.close();
}
class Test {
    test;
    constructor(test) {
        this.test = test;
    }
}
testMongoDB();
