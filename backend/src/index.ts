('use strict');
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';

import { ObjectId } from 'mongodb';
import dbConnectCheck from './utils/dbConnect.js';
import documentRoutes from './Routes/documents.js';
import { run } from './utils/mongoDbCheck.js';
import { findDocById } from './utils/docFunction.js';

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
app.use(cors(corsOptions));
app.use(documentRoutes);

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

run().catch(console.dir);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
