import client from '../config/database.js';
import { Db } from 'mongodb';

let database: undefined | Db;

async function getDbConnection(dbName: string, collectionName: string) {
  if (!database) {
    await client.connect();
    console.log('Connected successfully to database');
    database = await client.db(dbName); // Replace with your database name
  }
  const collection = await database.collection(collectionName);
  return collection;
}

export default getDbConnection;
