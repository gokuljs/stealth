'use strict';
import express from 'express';
import http from 'http';
import home from './Routes/homeRouter.js';
import { Server } from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});
app.use(home);
const port = 4000;
io.on('connection', (socket) => {
    console.log('socket connected');
    socket.on('get-document', (id) => {
        console.log(id);
        const data = '';
        socket.join(id);
        socket.emit('load-document', data);
        socket.on('send-changes', (delta) => {
            socket.broadcast.to(id).emit('receive-changes', delta);
        });
    });
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
