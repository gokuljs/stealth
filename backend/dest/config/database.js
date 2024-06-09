import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = 'mongodb+srv://jsgokul123:P8sDAQpYSKck8tyh@cluster0.pvmedmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    connectTimeoutMS: 30000, // Increase connection timeout
    socketTimeoutMS: 45000, // Increase socket timeout
    serverSelectionTimeoutMS: 10000, // Increase server selection timeout
    retryWrites: true,
});
export default client;
