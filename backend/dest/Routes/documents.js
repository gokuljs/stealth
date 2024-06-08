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
        const defaultData = {
            title: title,
            data: {},
        };
        const document = await collection.insertOne(defaultData);
        console.log('document saved', document);
        res.status(200).send({
            id: document.insertedId,
            ...defaultData,
        });
    }
    catch (error) {
        console.log(error);
    }
});
export default router;
