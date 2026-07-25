import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import createServer from '../../src/Infrastructures/http/createServer.js';
import container from '../../src/Infrastructures/container.js';
import pool from '../../src/Infrastructures/database/postgres/pool.js';
import UsersTableTestHelper from '../UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../CommentsTableTestHelper.js';

describe('Thread flow integration test', () => {
  let server;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should handle full thread lifecycle: register → create thread → add comment → get detail', async () => {
    // Step 1: Register a user
    const registerRes = await supertest(server)
      .post('/users')
      .send({
        username: 'thread_user',
        password: 'secretpassword',
        fullname: 'Thread User',
      });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.status).toBe('success');

    // Step 2: Login to get access token
    const loginRes = await supertest(server)
      .post('/authentications')
      .send({
        username: 'thread_user',
        password: 'secretpassword',
      });

    expect(loginRes.status).toBe(201);
    expect(loginRes.body.status).toBe('success');
    const { accessToken } = loginRes.body.data;

    // Step 3: Create a thread
    const createThreadRes = await supertest(server)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'My Test Thread',
        body: 'This is the body of my test thread.',
      });

    expect(createThreadRes.status).toBe(201);
    expect(createThreadRes.body.status).toBe('success');
    const threadId = createThreadRes.body.data.addedThread.id;
    expect(threadId).toBeDefined();

    // Step 4: Add a comment to the thread
    const addCommentRes = await supertest(server)
      .post(`/threads/${threadId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'This is a test comment',
      });

    expect(addCommentRes.status).toBe(201);
    expect(addCommentRes.body.status).toBe('success');
    expect(addCommentRes.body.data.addedComment.id).toBeDefined();

    // Step 5: Add a second comment
    const addComment2Res = await supertest(server)
      .post(`/threads/${threadId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'This is another comment',
      });

    expect(addComment2Res.status).toBe(201);

    // Step 6: Get thread detail (should include comments)
    const detailRes = await supertest(server)
      .get(`/threads/${threadId}`);

    expect(detailRes.status).toBe(200);
    expect(detailRes.body.status).toBe('success');
    expect(detailRes.body.data.thread.id).toBe(threadId);
    expect(detailRes.body.data.thread.title).toBe('My Test Thread');
    expect(detailRes.body.data.thread.body).toBe('This is the body of my test thread.');
    expect(detailRes.body.data.thread.username).toBe('thread_user');
    expect(detailRes.body.data.thread.comments).toHaveLength(2);
    expect(detailRes.body.data.thread.comments[0].content).toBe('This is a test comment');
  });

  it('should return 401 when creating thread without auth', async () => {
    const res = await supertest(server)
      .post('/threads')
      .send({
        title: 'Unauthorized Thread',
        body: 'Should fail',
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('fail');
  });

  it('should return 401 when adding comment without auth', async () => {
    const res = await supertest(server)
      .post('/threads/thread-123/comments')
      .send({
        content: 'Unauthorized comment',
      });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('fail');
  });

  it('should return 404 for non-existent thread', async () => {
    const res = await supertest(server)
      .get('/threads/non-existent-thread-id');

    expect(res.status).toBe(404);
    expect(res.body.status).toBe('fail');
  });

  it('should return thread detail with deleted comments marked', async () => {
    // Register and login
    const registerRes = await supertest(server)
      .post('/users')
      .send({
        username: 'delete_user',
        password: 'secretpassword',
        fullname: 'Delete User',
      });
    expect(registerRes.status).toBe(201);

    const loginRes = await supertest(server)
      .post('/authentications')
      .send({
        username: 'delete_user',
        password: 'secretpassword',
      });
    const { accessToken } = loginRes.body.data;

    // Create thread
    const createRes = await supertest(server)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Del Thread', body: 'Body' });
    const threadId = createRes.body.data.addedThread.id;

    // Add comment
    const commentRes = await supertest(server)
      .post(`/threads/${threadId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Delete me' });
    const commentId = commentRes.body.data.addedComment.id;

    // Delete comment
    const deleteRes = await supertest(server)
      .delete(`/threads/${threadId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(deleteRes.status).toBe(200);

    // Get thread detail
    const detailRes = await supertest(server)
      .get(`/threads/${threadId}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.data.thread.comments).toHaveLength(1);
    expect(detailRes.body.data.thread.comments[0].content).toBe('**komentar telah dihapus**');
  });
});
