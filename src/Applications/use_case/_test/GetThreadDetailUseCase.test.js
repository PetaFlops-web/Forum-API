import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const newThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2026-03-26T00:00:00.000Z',
      username: 'dicoding',
    };

    const newComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: '2026-03-26T01:00:00.000Z',
        content: 'sebuah komentar',
      },
      {
        id: 'comment-2',
        username: 'dicoding',
        date: '2026-03-26T02:00:00.000Z',
        content: '**komentar telah dihapus**',
      },
    ];

    const expectedThreadDetail = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2026-03-26T00:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-1',
          username: 'johndoe',
          date: '2026-03-26T01:00:00.000Z',
          content: 'sebuah komentar',
        },
        {
          id: 'comment-2',
          username: 'dicoding',
          date: '2026-03-26T02:00:00.000Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = vi
      .fn()
      .mockImplementation(() => Promise.resolve(newThread));
    mockCommentRepository.getCommentsByThreadId = vi
      .fn()
      .mockImplementation(() => Promise.resolve(newComments));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId,
    );
  });
});
