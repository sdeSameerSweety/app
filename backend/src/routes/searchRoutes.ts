import express from 'express';
import {
  searchColleges,
  searchCourses,
  advancedReviewSearch,
  getFilterOptions,
  getCollegeById,
} from '../controllers/searchController';

const router = express.Router();

router.get('/colleges', searchColleges);
router.get('/colleges/:id', getCollegeById);
router.get('/courses', searchCourses);
router.get('/reviews', advancedReviewSearch);
router.get('/filters', getFilterOptions);

export default router;
