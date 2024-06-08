import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = 'mongodb+srv://jsgokul123:<gv9oocsdu9Uxd60N>@cluster0.pvmedmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
export default client;
