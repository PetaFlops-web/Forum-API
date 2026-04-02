import CreatedComment from '../CreatedComment.js';

describe('CreatedComment', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {};
    expect(() => new CreatedComment(payload)).toThrowError(
      'CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      content: 123,
      owner: 123,
    };
    expect(() => new CreatedComment(payload)).toThrowError(
      'CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CreatedComment object correctly', () => {
    const { id, content, owner } = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };
    const createdComment = new CreatedComment({ id, content, owner });
    expect(createdComment.id).toEqual(id);
    expect(createdComment.content).toEqual(content);
    expect(createdComment.owner).toEqual(owner);
  });
});
