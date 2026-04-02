import { nanoid } from 'nanoid';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import CreatedThread from '../../Domains/threads/entities/CreatedThread.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool) {
    super();
    this._pool = pool;
    this._idGenerator = () => nanoid(16);
  }

  async addThread(createThread) {
    const { title, body, owner } = createThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);
    return new CreatedThread(result.rows[0]);
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }

    return result.rows[0];
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
             FROM threads
             LEFT JOIN users ON threads.owner = users.id
             WHERE threads.id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return result.rows[0];
  }
}

export default ThreadRepositoryPostgres;
