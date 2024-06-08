'use strict';
import express from 'express';
import http from 'http';
import home from './Routes/homeRouter.js';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import { uuid } from 'uuidv4';
import cors from 'cors';
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
app.post('/create-document', (req, res) => {
    const { title } = req.body; // Extract title from the request body
    if (!title) {
        return res.status(400).send({ message: 'Title is required' });
    }
    const document = {
        id: uuid() + Date.now(), // Mock ID
        title: title,
    };
    res.status(200).send(document);
});
io.on('connection', (socket) => {
    console.log('socket is connected');
    socket.on('get-document', (docId) => {
        const data = '';
        socket.join(docId);
        socket.emit('load-document', data);
        socket.on('send-changes', (delta) => {
            console.log(delta);
            socket.broadcast.to(docId).emit('receive-changes', delta);
        });
    });
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
