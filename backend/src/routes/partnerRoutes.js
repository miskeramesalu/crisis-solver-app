import express from 'express';
import { registerPartner, getPartners } from '../controllers/partnerController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerPartner);
router.get('/', protect, restrictTo('admin'), getPartners);

export default router;