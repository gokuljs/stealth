import { Request, Response } from 'express';
import getDbConnection from '../utils/dbConnect.js';
import { checkPasswordStrength, isValidEmail } from '../utils/validationUtils.js';
import bcrypt from 'bcrypt';

export const registerService = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).send('Please enter a valid email address.');
    }
    if (!password || !checkPasswordStrength(password)) {
      return res.status(400).send('Password does not meet the strength requirements.');
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = {
      email: email,
      password: hash,
    };
    const collection = await getDbConnection('stealth', 'user');
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(409).send('User already registered.');
    }
    await collection.insertOne(user);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    // Send a 500 Internal Server error in case of exception
    res.status(500).send('An error occurred');
  }
};
