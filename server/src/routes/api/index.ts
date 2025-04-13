import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';
import historyRoutes from './historyRoutes.js';
router.use('/weather', weatherRoutes);
router.use('/history', historyRoutes);
export default router;
