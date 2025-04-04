import { Router } from 'express';

const htmlRouter = Router();

htmlRouter.get('/', (_req, res) => {
  res.send('HTML Route');
});

export default htmlRouter;
