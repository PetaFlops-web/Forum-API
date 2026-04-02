import CreateComment from '../CreateComment.js';

describe('CreateComment', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {};
    expect(() => new CreateComment(payload)).toThrowError(
      'CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      content: 123,
    };
    expect(() => new CreateComment(payload)).toThrowError(
      'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CreateComment object correctly', () => {
    const { content } = {
      content: 'sebuah comment',
    };
    const createComment = new CreateComment({ content });
    expect(createComment.content).toEqual(content);
  });
});
