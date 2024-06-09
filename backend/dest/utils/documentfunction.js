import { ObjectId } from 'mongodb';
import getDbConnection from './dbConnect.js';
export async function findDocById(id) {
  try {
    if (!id) return;
    const collection = await getDbConnection('stealth', 'documents');
    const document = await collection.findOne({ _id: new ObjectId(id) });
    if (document) return document;
  } catch (error) {
    console.log({ error });
  }
}
