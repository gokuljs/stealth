import { Router } from 'express';
import getDbConnection from '../utils/dbConnect.js';
import { ensureAuthenticated } from '../index.js';

const router = Router();
router.post('/create-document', ensureAuthenticated, async (req, res) => {
  try {
    const { title, email } = req.body; // Extract title from the request body
    if (!title) {
      return res.status(400).send({ message: 'Title is required' });
    }
    const collection = await getDbConnection('stealth', 'documents');
    const timestamp = new Date();
    const defaultData = {
      title: title,
      data: {},
      collaborators: [
        {
          email,
          permission: 'owner',
        },
      ],
      lastUpdatedAt: timestamp,
      createdAt: timestamp,
    };
    const document = await collection.insertOne(defaultData);
    console.log('document saved');
    res.status(200).send({
      id: document.insertedId,
      ...defaultData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while creating the document');
  }
});

router.get('/allDocuments/:email', ensureAuthenticated, async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      res.status(400).send({ message: 'email not found' });
    }
    const collection = await getDbConnection('stealth', 'documents');
    const data = await collection
      .find({
        'collaborators.email': email,
      })
      .sort({ createdAt: -1 })
      .toArray();
    if (!data) {
      res.status(404).send('No documents found');
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).send('An error occurred while fetching documents');
  }
});

export default router;
