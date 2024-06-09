/* eslint-disable @typescript-eslint/no-explicit-any */
('use strict');
import dotenv from 'dotenv';
dotenv.config({
    path: '../config.env',
});
import express from 'express';
import http from 'http';
import session from 'express-session';
import { Server } from 'socket.io';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import dbConnectCheck from './utils/dbConnect.js';
import documentRoutes from './Routes/documents.js';
import registerRoutes from './Routes/register.js';
import { run } from './utils/mongoDbCheck.js';
import { findDocById } from './utils/docFunction.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
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
    credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(session({
    secret: 'your_secret_key', // Replace with your secret key
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(registerRoutes);
app.use(documentRoutes);
// Passport configuration
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        console.log('here', email, password);
        const collection = await dbConnectCheck('stealth', 'user');
        const user = await collection.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err)
                return done(err);
            if (isMatch) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user, done) => {
    done(null, user.email);
});
passport.deserializeUser(async (email, done) => {
    const collection = await dbConnectCheck('stealth', 'user');
    const user = await collection.findOne({ email });
    done(null, user);
});
export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).json({ message: 'Authentication failed', info });
        req.logIn(user, (err) => {
            if (err)
                return next(err);
            return res.json({ message: 'Login successful' });
        });
    })(req, res, next);
});
app.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Logout successful' });
    });
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
                const timestamp = new Date();
                console.log({ docId });
                await collection.findOneAndUpdate({ _id: new ObjectId(docId) }, { $set: { data: data, lastUpdatedAt: timestamp } });
            });
        }
        catch (error) {
            console.error('Error finding document:', error);
            socket.emit('error', 'Failed to load document');
        }
    });
});
run().catch(console.dir);
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
