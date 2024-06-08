import { ObjectId } from 'mongodb';
import dbConnectCheck from './dbConnect.js';

export async function findDocById(id: string) {
  try {
    if (!id) return;
    const collection = await dbConnectCheck('stealth', 'documents');
    const document = await collection.findOne({ _id: new ObjectId(id) });
    if (document) return document;
  } catch (error) {
    console.log({ error });
  }
}
