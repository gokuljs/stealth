import { Router } from 'express';
import getDbConnection from '../utils/dbConnect.js';
const router = Router();
router.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    const collection = await await getDbConnection('stealth', 'documents');
    res.send(200);
  } catch (error) {
    console.log(error);
  }
});
export default router;
