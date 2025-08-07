import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPost,
  publishPost,
  getPostAnalytics,
} from '../controllers/postController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('content').notEmpty().isLength({ max: 2200 }),
    body('platforms').isArray().notEmpty(),
    body('platforms.*.platform').isIn(['instagram', 'tiktok', 'pinterest', 'facebook']),
    body('platforms.*.accountId').notEmpty(),
  ],
  validate,
  createPost
);

router.put(
  '/:postId',
  [
    body('content').optional().isLength({ max: 2200 }),
    body('platforms').optional().isArray(),
  ],
  validate,
  updatePost
);

router.delete('/:postId', deletePost);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['draft', 'scheduled', 'publishing', 'published', 'failed']),
    query('platform').optional().isIn(['instagram', 'tiktok', 'pinterest', 'facebook']),
  ],
  validate,
  getPosts
);

router.get('/:postId', getPost);

router.post(
  '/:postId/publish',
  [body('platformIds').optional().isArray()],
  validate,
  publishPost
);

router.get('/:postId/analytics', getPostAnalytics);

export default router;