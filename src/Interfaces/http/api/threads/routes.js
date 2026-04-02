import express from 'express';
import authMiddleware from '../../../../Infrastructures/http/middleware/auth.js';

const createThreadsRouter = (handler) => {
  const router = express.Router();

  router.post('/', authMiddleware, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadDetailHandler);
  return router;
};

export default createThreadsRouter;
