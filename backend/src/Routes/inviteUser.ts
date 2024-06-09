import { Router } from 'express';
import { ensureAuthenticated } from '../utils/authUtils.js';
import { inviteUser } from '../service/inviteUserService.js';

const router = Router();

router.post('/inviteUser', ensureAuthenticated, inviteUser);

export default router;
