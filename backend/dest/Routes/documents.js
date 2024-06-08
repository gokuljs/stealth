import { Router } from 'express';
import dbConnectCheck from '../utils/dbConnect.js';
const router = Router();
router.post('/create-document', async (req, res) => {
    try {
        const { title } = req.body; // Extract title from the request body
        if (!title) {
            return res.status(400).send({ message: 'Title is required' });
        }
        const collection = await dbConnectCheck('stealth', 'documents');
        const timestamp = new Date();
        const defaultData = {
            title: title,
            data: {},
            lastUpdatedAt: timestamp,
            createdAt: timestamp,
        };
        const document = await collection.insertOne(defaultData);
        console.log('document saved');
        res.status(200).send({
            id: document.insertedId,
            ...defaultData,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while creating the document');
    }
});
router.get('/allDocuments', async (req, res) => {
    try {
        const collection = await dbConnectCheck('stealth', 'documents');
        const data = await collection.find().sort({ createdAt: -1 }).toArray();
        if (!data || data.length === 0) {
            res.status(404).send('No documents found');
        }
        else {
            res.status(200).json(data);
        }
    }
    catch (error) {
        res.status(500).send('An error occurred while fetching documents');
    }
});
export default router;
