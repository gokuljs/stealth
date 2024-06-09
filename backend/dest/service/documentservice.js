import getDbConnection from '../utils/dbConnect.js';
export var Permission;
(function (Permission) {
    Permission["OWNER"] = "owner";
    Permission["EDITOR"] = "editor";
    Permission["READONLY"] = "readOnly";
})(Permission || (Permission = {}));
export const createDocument = async (req, res) => {
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
                    permission: Permission.OWNER,
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
    }
    catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while creating the document');
    }
};
export const getAllDocuments = async (req, res) => {
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
        }
        else {
            res.status(200).json(data);
        }
    }
    catch (error) {
        res.status(500).send('An error occurred while fetching documents');
    }
};
