import { Router } from 'express';
import dbConnectCheck from '../utils/dbConnect.js';
const router = Router();
router.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        const collection = await await dbConnectCheck('stealth', 'documents');
        res.send(200);
    }
    catch (error) {
        console.log(error);
    }
});
export default router;
