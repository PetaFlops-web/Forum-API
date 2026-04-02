import CreateComment from '../../Domains/comments/entities/CreateComment.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    const createComment = new CreateComment(useCasePayload);

    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return this._commentRepository.addComment(createComment, threadId, owner);
  }
}

export default AddCommentUseCase;
