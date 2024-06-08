import client from '../config/database.js';
async function dbConnectCheck(dbName, collectionName) {
    await client.connect();
    console.log('Connected successfully to server');
    const database = await client.db(dbName); // Replace with your database name
    const collection = await database.collection(collectionName);
    return collection;
}
export default dbConnectCheck;
