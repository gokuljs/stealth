import { Router } from 'express';
import { registerService } from '../service/registerService.js';

const router = Router();

router.post('/register', registerService);

export default router;
