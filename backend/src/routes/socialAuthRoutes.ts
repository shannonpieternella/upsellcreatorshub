import { Router } from 'express';
import { body } from 'express-validator';
import {
  connectFacebook,
  connectTikTok,
  connectPinterest,
  disconnectAccount,
  getConnectedAccounts,
  refreshAccountToken,
} from '../controllers/socialAuthController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.post(
  '/connect/facebook',
  [body('code').notEmpty()],
  validate,
  connectFacebook
);

router.post(
  '/connect/tiktok',
  [body('code').notEmpty()],
  validate,
  connectTikTok
);

router.post(
  '/connect/pinterest',
  [body('code').notEmpty()],
  validate,
  connectPinterest
);

router.delete('/disconnect/:accountId', disconnectAccount);

router.get('/accounts', getConnectedAccounts);

router.post('/refresh/:accountId', refreshAccountToken);

export default router;