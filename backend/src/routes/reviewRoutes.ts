import express from 'express';
import {
  createReview,
  getReviews,
  getReviewById,
  upvoteReview,
  downvoteReview,
} from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createReview);
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.post('/:id/upvote', authenticateToken, upvoteReview);
router.post('/:id/downvote', authenticateToken, downvoteReview);

export default router;
