import { Router } from 'express';
import { ensureAuthenticated } from '../index.js';
import dbConnectCheck from '../utils/dbConnect.js';
import { ObjectId } from 'mongodb';

const router = Router();

router.post('/inviteUser', ensureAuthenticated, async (req, res) => {
  try {
    const { docId, email, permissions } = req.body;
    if (!docId || !email || !permissions) {
      return res.status(404).json({ error: 'Missing required fields' });
    }
    const collection = await dbConnectCheck('stealth', 'documents');
    const document = await collection.findOne({ _id: new ObjectId(docId) });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    console.log(document);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collaboratorIndex = document.collaborators.findIndex((collaborator: any) => collaborator.email === email);
    if (collaboratorIndex !== -1) {
      if (document.collaborators[collaboratorIndex].permissions === 'owner') {
        return res.status(400).json({ message: 'Cannot update permissions for an owner' });
      }
      if (document.collaborators[collaboratorIndex].permissions === permissions) {
        return res.status(400).json({ message: 'Already invited with the same permissions' });
      } else {
        document.collaborators[collaboratorIndex].permissions = permissions;
      }
    } else {
      document.collaborators.push({ email, permissions });
    }
    document.lastUpdatedAt = new Date();
    await collection.updateOne(
      { _id: new ObjectId(docId) },
      { $set: { collaborators: document.collaborators, lastUpdatedAt: document.lastUpdatedAt } },
    );
    res.status(200).json({ message: 'User invited successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
