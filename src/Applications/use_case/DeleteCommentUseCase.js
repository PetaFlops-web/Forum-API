import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;

    await this._threadRepository.getThreadById(threadId);

    const commentOwner =
      await this._commentRepository.verifyCommentOwner(commentId);

    if (!commentOwner) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    if (commentOwner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }

    await this._commentRepository.deleteComment(commentId);
  }
}

export default DeleteCommentUseCase;
