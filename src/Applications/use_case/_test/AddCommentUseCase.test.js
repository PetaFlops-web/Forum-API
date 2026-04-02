import CreateComment from '../../../Domains/comments/entities/CreateComment.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddCommentUseCase from '../AddCommentUseCase.js';

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
    };
    const expectedThreadId = 'thread-123';
    const expectedOwner = 'user-123';

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = vi
      .fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123' }));
    mockCommentRepository.addComment = vi.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }),
    );

    const expectedCreatedComment = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdComment = await addCommentUseCase.execute(
      useCasePayload,
      expectedThreadId,
      expectedOwner,
    );

    // Assert
    expect(createdComment).toStrictEqual(expectedCreatedComment);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(expectedThreadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new CreateComment(useCasePayload),
      expectedThreadId,
      expectedOwner,
    );
  });
});
