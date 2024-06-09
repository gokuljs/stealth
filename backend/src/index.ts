('use strict');
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import session from 'express-session';
import { Server } from 'socket.io';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import getDbConnection from './utils/dbConnect.js';
import documentRoutes from './Routes/documents.js';
import registerRoutes from './Routes/register.js';
import inviteUserRouter from './Routes/inviteUser.js';
import authRouter from './Routes/auth.js';
import { run } from './utils/mongoDbCheck.js';
import { findDocById } from './utils/docFunction.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

const port = process.env.PORT || 4000;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_URL,
    methods: ['GET', 'POST'],
  },
});
const corsOptions = {
  origin: process.env.REACT_APP_URL, // Replace with the URL of your React app
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRET_KEY || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);
app.use(registerRoutes);
app.use(documentRoutes);
app.use(inviteUserRouter);

// Passport configuration
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const collection = await getDbConnection('stealth', 'user');
      const user = await collection.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  const collection = await getDbConnection('stealth', 'user');
  const user = await collection.findOne({ email });
  done(null, user);
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
        const collection = await getDbConnection('stealth', 'documents');
        const timestamp = new Date();
        console.log({ docId });
        await collection.findOneAndUpdate({ _id: new ObjectId(docId) }, { $set: { data: data, lastUpdatedAt: timestamp } });
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
