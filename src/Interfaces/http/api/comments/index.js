import AddCommentHandler from './handle.js';
import createCommentsRouter from './routes.js';

export default (container) => {
  const addCommentHandler = new AddCommentHandler(container);
  return createCommentsRouter(addCommentHandler);
};
