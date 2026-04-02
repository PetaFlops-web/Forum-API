import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    const rawComments =
      await this._commentRepository.getCommentsByThreadId(threadId);

    const mappedComments = rawComments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete
        ? '**komentar telah dihapus**'
        : comment.content,
    }));

    return {
      ...thread,
      comments: mappedComments,
    };
  }
}

export default GetThreadUseCase;
