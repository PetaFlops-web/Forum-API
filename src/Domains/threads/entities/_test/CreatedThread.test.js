import CreatedThread from '../CreatedThread.js';

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'sebuah thread',
    };

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError(
      'CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'sebuah thread',
      owner: 1234,
    };

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError(
      'CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'sebuah thread',
      owner: 'user-1234',
    };

    // Action
    const createdThread = new CreatedThread(payload);

    // Assert
    expect(createdThread).toBeInstanceOf(CreatedThread);
    expect(createdThread.id).toEqual(payload.id);
    expect(createdThread.title).toEqual(payload.title);
    expect(createdThread.owner).toEqual(payload.owner);
  });
});
