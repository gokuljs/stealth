import client from '../config/database.js';
let database;
async function getDbConnection(dbName, collectionName) {
    if (!database) {
        await client.connect();
        console.log('Connected successfully to database');
        database = await client.db(dbName); // Replace with your database name
    }
    const collection = await database.collection(collectionName);
    return collection;
}
export default getDbConnection;
