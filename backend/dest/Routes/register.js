import { Router } from 'express';
import dbConnectCheck from '../utils/dbConnect.js';
import bcrypt from 'bcrypt';
const router = Router();
function checkPasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
}
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
router.post('/register', async (req, res) => {
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
        const collection = await dbConnectCheck('stealth', 'user');
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User already registered.');
        }
        await collection.insertOne(user);
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        // Send a 500 Internal Server error in case of exception
        res.status(500).send('An error occurred');
    }
});
export default router;
