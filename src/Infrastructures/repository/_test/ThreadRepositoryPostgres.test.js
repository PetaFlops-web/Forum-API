import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import CreatedThread from '../../../Domains/threads/entities/CreatedThread.js';
import CreateThread from '../../../Domains/threads/entities/CreateThread.js';

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-test-123',
        username: 'dicoding',
      });

      const createThread = new CreateThread({
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-test-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const createdThread =
        await threadRepositoryPostgres.addThread(createThread);

      // Assert
      expect(createdThread).toBeInstanceOf(CreatedThread);
      expect(createdThread.id).toBeDefined();
      expect(createdThread.title).toEqual('sebuah thread');
      expect(createdThread.owner).toEqual('user-test-123');

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById(
        createdThread.id,
      );
      expect(threads).toHaveLength(1);
    });
  });

  describe('verifyThreadExists', () => {
    it('should not throw error when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExists('thread-123'),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const result =
        await threadRepositoryPostgres.getThreadById('thread-tidak-ada');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getThreadById', () => {
    it('should return thread detail correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('sebuah thread');
      expect(thread.body).toEqual('sebuah body');
      expect(thread.username).toEqual('dicoding');
      expect(thread.date).toBeDefined();
    });

    it('should return null when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-tidak-ada'),
      ).resolves.toBeNull();
    });
  });
});
