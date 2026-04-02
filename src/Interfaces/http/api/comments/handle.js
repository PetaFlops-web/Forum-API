import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
class AddCommentHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const addCommentUseCase = this._container.getInstance(
        AddCommentUseCase.name,
      );

      const useCasePayload = {
        content: req.body.content,
      };
      const { threadId } = req.params;
      const { id: owner } = req.user;

      const createdComment = await addCommentUseCase.execute(
        useCasePayload,
        threadId,
        owner,
      );

      res.status(201).json({
        status: 'success',
        data: {
          addedComment: createdComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const deleteCommentUseCase = this._container.getInstance(
        DeleteCommentUseCase.name,
      );

      const { threadId, commentId } = req.params;

      const { id: owner } = req.user;

      await deleteCommentUseCase.execute({
        threadId,
        commentId,
        owner,
      });

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AddCommentHandler;
