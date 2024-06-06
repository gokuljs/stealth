'use strict';
import express from 'express';
import http from 'http';
import home from './Routes/HomeRouter';
const app = express();
const server = http.createServer(app);
app.use(home);
const port = 4000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
