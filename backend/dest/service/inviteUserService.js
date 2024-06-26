import { ObjectId } from 'mongodb';
import getDbConnection from '../utils/dbConnect.js';
export const inviteUser = async (req, res) => {
    try {
        const { docId, email, permission } = req.body;
        if (!docId || !email || !permission) {
            return res.status(404).json({ error: 'Missing required fields' });
        }
        const collection = await getDbConnection('stealth', 'documents');
        const document = await collection.findOne({ _id: new ObjectId(docId) });
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const collaboratorIndex = document.collaborators.findIndex((collaborator) => collaborator.email === email);
        if (collaboratorIndex !== -1) {
            if (document.collaborators[collaboratorIndex].permission === 'owner') {
                return res.status(400).json({ message: 'Cannot update permission for an owner' });
            }
            if (document.collaborators[collaboratorIndex].permission === permission) {
                return res.status(400).json({ message: 'Already invited with the same permission' });
            }
            else {
                document.collaborators[collaboratorIndex].permission = permission;
            }
        }
        else {
            document.collaborators.push({ email, permission });
        }
        document.lastUpdatedAt = new Date();
        await collection.updateOne({ _id: new ObjectId(docId) }, { $set: { collaborators: document.collaborators, lastUpdatedAt: document.lastUpdatedAt } });
        res.status(200).json({ message: 'User invited successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
