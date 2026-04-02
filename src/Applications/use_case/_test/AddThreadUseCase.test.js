import AddThreadUseCase from '../AddThreadUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'thread body',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = vi.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'dicoding',
        owner: 'user-123',
      }),
    );

    const expectedCreatedThread = {
      id: 'thread-123',
      title: 'dicoding',
      owner: 'user-123',
    };

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(expectedCreatedThread);

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });
  });
});
