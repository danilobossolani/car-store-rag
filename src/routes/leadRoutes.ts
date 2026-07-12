import { Router } from 'express';
import { postLead, getLeads } from '../controllers/leadController';

const router = Router();

router.post('/', postLead);
router.get('/', getLeads);

export default router;