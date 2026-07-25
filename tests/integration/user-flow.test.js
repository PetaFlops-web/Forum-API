import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import createServer from '../../src/Infrastructures/http/createServer.js';
import container from '../../src/Infrastructures/container.js';
import pool from '../../src/Infrastructures/database/postgres/pool.js';
import UsersTableTestHelper from '../UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../AuthenticationsTableTestHelper.js';

describe('User flow integration test', () => {
  let server;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should handle full auth lifecycle: register → login → logout → refresh', async () => {
    // Step 1: Register a new user
    const registerRes = await supertest(server)
      .post('/users')
      .send({
        username: 'flow_user',
        password: 'securepass123',
        fullname: 'Flow Test User',
      });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.status).toBe('success');
    expect(registerRes.body.data.addedUser.id).toBeDefined();
    expect(registerRes.body.data.addedUser.username).toBe('flow_user');
    expect(registerRes.body.data.addedUser.fullname).toBe('Flow Test User');
    expect(registerRes.body.data.addedUser.password).toBeUndefined();

    // Step 2: Login with registered user
    const loginRes = await supertest(server)
      .post('/authentications')
      .send({
        username: 'flow_user',
        password: 'securepass123',
      });

    expect(loginRes.status).toBe(201);
    expect(loginRes.body.status).toBe('success');
    expect(loginRes.body.data.accessToken).toBeDefined();
    expect(loginRes.body.data.refreshToken).toBeDefined();
    const { accessToken, refreshToken } = loginRes.body.data;

    // Step 3: Refresh the access token
    // Wait >1s to ensure different iat (JWT timestamp precision is seconds)
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const refreshRes = await supertest(server)
      .put('/authentications')
      .send({
        refreshToken,
      });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.status).toBe('success');
    expect(refreshRes.body.data.accessToken).toBeDefined();
    expect(refreshRes.body.data.accessToken).not.toBe(accessToken);

    // Step 4: Logout (invalidate refresh token)
    const logoutRes = await supertest(server)
      .delete('/authentications')
      .send({
        refreshToken,
      });

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.status).toBe('success');

    // Step 5: Try to refresh with invalidated token (should fail)
    const refreshAfterLogoutRes = await supertest(server)
      .put('/authentications')
      .send({
        refreshToken,
      });

    expect(refreshAfterLogoutRes.status).toBe(400);
    expect(refreshAfterLogoutRes.body.status).toBe('fail');
  });

  it('should return 400 when login with wrong password', async () => {
    // Register first
    await supertest(server)
      .post('/users')
      .send({
        username: 'wrong_pass_user',
        password: 'correctpass',
        fullname: 'Wrong Pass User',
      });

    const loginRes = await supertest(server)
      .post('/authentications')
      .send({
        username: 'wrong_pass_user',
        password: 'wrongpass',
      });

    expect(loginRes.status).toBe(401);
    expect(loginRes.body.status).toBe('fail');
  });

  it('should return 400 when login with non-existent username', async () => {
    const loginRes = await supertest(server)
      .post('/authentications')
      .send({
        username: 'nonexistent_user_xyz',
        password: 'anypassword',
      });

    expect(loginRes.status).toBe(400);
    expect(loginRes.body.status).toBe('fail');
  });

  it('should return 400 when registering with existing username', async () => {
    // Register user
    await supertest(server)
      .post('/users')
      .send({
        username: 'duplicate_user',
        password: 'password123',
        fullname: 'Duplicate User',
      });

    // Try to register again with same username
    const res = await supertest(server)
      .post('/users')
      .send({
        username: 'duplicate_user',
        password: 'password456',
        fullname: 'Duplicate User Again',
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('should return 400 when registering with missing fields', async () => {
    const res = await supertest(server)
      .post('/users')
      .send({
        username: 'partial_user',
        // missing password and fullname
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('should return 400 when login with missing fields', async () => {
    const res = await supertest(server)
      .post('/authentications')
      .send({
        username: 'someuser',
        // missing password
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });
});
