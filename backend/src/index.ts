('use strict');
import express from 'express';
import http from 'http';
import home from './Routes/homeRouter.js';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import client from './config/database.js';
import { ObjectId } from 'mongodb';
import dbConnectCheck from './utils/dbConnect.js';
import { findDocById } from './utils/documentfunction.js';

const port = 4000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with the URL of your React app
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(bodyParser.json());
app.use(home);
app.use(cors(corsOptions));

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.post('/create-document', async (req, res) => {
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
  } catch (error) {
    console.log(error);
  }
});

io.on('connection', (socket) => {
  console.log('socket is connected');
  socket.on('get-document', async (docId) => {
    try {
      const document = await findDocById(docId);

      socket.join(docId);
      socket.emit('load-document', document ? document?.data : '');
      socket.on('send-changes', (delta) => {
        socket.broadcast.to(docId).emit('receive-changes', delta);
      });
      socket.on('save-document', async (data) => {
        const collection = await dbConnectCheck('stealth', 'documents');

        await collection.findOneAndUpdate({ _id: new ObjectId(docId) }, { $set: { data: data } });
      });
    } catch (error) {
      console.error('Error finding document:', error);
      socket.emit('error', 'Failed to load document');
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
