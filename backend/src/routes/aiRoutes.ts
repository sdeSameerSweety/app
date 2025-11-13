import express from 'express';
import { chatWithAI, getConversationHistory } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/chat', authenticateToken, chatWithAI);
router.get('/conversations', authenticateToken, getConversationHistory);

export default router;
