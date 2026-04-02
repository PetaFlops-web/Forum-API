class CreateComment {
  constructor({ content }) {
    this._verifyPayload({ content });
    this.content = content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string') {
      throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default CreateComment;
