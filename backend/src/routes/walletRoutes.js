import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { getBalance, addCoins } from '../controllers/walletController.js';
import { requestWithdrawal, getWithdrawals, reviewWithdrawal } from '../controllers/withdrawalController.js';
import { validate, withdrawalSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/balance', getBalance);
router.post('/add-coins', restrictTo('admin'), addCoins); // admin adds coins to user
router.post('/withdraw', validate(withdrawalSchema), requestWithdrawal);
router.get('/withdrawals', getWithdrawals);
router.put('/withdrawals/:id/review', restrictTo('admin'), reviewWithdrawal);

export default router;