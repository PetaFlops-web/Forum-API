import CreateThread from '../CreateThread.js';

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: '',
      body: '',
      owner: '',
    };

    // Action & Assert
    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 1234,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
