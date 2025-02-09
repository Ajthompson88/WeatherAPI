import { Router } from 'express';
const router = Router();

import weatherRoutes from './routes/api/weatherRoutes';

router.use('/weather', weatherRoutes);

export default router;
