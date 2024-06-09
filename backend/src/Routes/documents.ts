import { Router } from 'express';
import { ensureAuthenticated } from '../utils/authUtils.js';
import { createDocument, getAllDocuments } from '../service/documentService.js';

const router = Router();

router.post('/create-document', ensureAuthenticated, createDocument);
router.get('/allDocuments/:email', ensureAuthenticated, getAllDocuments);

export default router;
