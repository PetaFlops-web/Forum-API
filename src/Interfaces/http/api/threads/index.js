import AddThreadHandler from './handler.js';
import createThreadsRouter from './routes.js';

export default (container) => {
  const addThreadHandler = new AddThreadHandler(container);
  return createThreadsRouter(addThreadHandler);
};
