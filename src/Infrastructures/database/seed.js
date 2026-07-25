/**
 * Database Seeder
 *
 * Inserts sample data: 3 users, 2 threads, 5 comments.
 * Run with:  node src/Infrastructures/database/seed.js
 */
import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

const pool = new pg.Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

const { rows: tableCheck } = await pool.query(`
  SELECT tablename FROM pg_catalog.pg_tables
  WHERE schemaname = 'public'
    AND tablename IN ('users', 'threads', 'comments')
`);
if (tableCheck.length < 3) {
  console.error('[seed] Error: Missing tables. Run migrations first:\n  npm run migrate up');
  process.exit(1);
}

const users = [
  { username: 'dicoding',  fullname: 'Dicoding Indonesia', password: 'secret' },
  { username: 'alice',     fullname: 'Alice Margatroid',   password: 'secret' },
  { username: 'bob',       fullname: 'Bob the Builder',    password: 'secret' },
];

for (const u of users) {
  const id = `user-${nanoid()}`;
  const hash = await bcrypt.hash(u.password, 10);
  await pool.query(
    'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
    [id, u.username, hash, u.fullname],
  );
  u._id = id; // save for later
}
console.log(`[seed] ${users.length} users seeded`);

const threads = [
  {
    title: 'Bagaimana cara belajar Back-End pemula?',
    body: 'Halo semua, saya baru mulai belajar back-end pakai Node.js. Ada saran resource atau roadmap yang cocok buat pemula? Terima kasih.',
    ownerUsername: 'dicoding',
  },
  {
    title: 'Clean Architecture di Node.js — worth it?',
    body: 'Apakah Clean Architecture benar-benar dibutuhkan untuk project Node.js skala kecil-menengah? Atau malah over-engineering? Pengen denger pendapat teman-teman.',
    ownerUsername: 'alice',
  },
];

for (const t of threads) {
  const { id: owner } = await pool.query('SELECT id FROM users WHERE username = $1', [
    t.ownerUsername,
  ]).then((r) => r.rows[0]);
  const id = `thread-${nanoid()}`;
  await pool.query(
    'INSERT INTO threads (id, title, body, owner) VALUES ($1, $2, $3, $4)',
    [id, t.title, t.body, owner],
  );
  t._id = id;
  t._owner = owner;
}
console.log(`[seed] ${threads.length} threads seeded`);

const comments = [
  {
    threadIdx: 0,
    ownerUsername: 'bob',
    content: 'Coba mulai dari roadmap.sh/backend. Lumayan terstruktur buat pemula.',
  },
  {
    threadIdx: 0,
    ownerUsername: 'alice',
    content: 'Setuju! Jangan lupa banyakin praktik bikin project kecil ya.',
  },
  {
    threadIdx: 1,
    ownerUsername: 'bob',
    content: 'Menurut gw Clean Architecture emang overkill buat project kecil. Tapi bagus buat portfolio sekalian belajar.',
  },
  {
    threadIdx: 1,
    ownerUsername: 'dicoding',
    content: 'Saya setuju, untuk production skala besar baru kerasa manfaatnya. Tapi gpp dicoba dari sekarang.',
  },
  {
    threadIdx: 1,
    ownerUsername: 'alice',
    content: 'Thanks masukannya! Jadi makin yakin buat implementasi di project final.',
  },
];

for (const c of comments) {
  const thread = threads[c.threadIdx];
  const { id: owner } = await pool.query('SELECT id FROM users WHERE username = $1', [
    c.ownerUsername,
  ]).then((r) => r.rows[0]);
  const id = `comment-${nanoid()}`;
  await pool.query(
    'INSERT INTO comments (id, thread_id, owner, content) VALUES ($1, $2, $3, $4)',
    [id, thread._id, owner, c.content],
  );
}
console.log(`[seed] ${comments.length} comments seeded`);

console.log('\n── Seeded accounts (password: "secret") ──');
for (const u of users) {
  console.log(`  ${u.username}  (${u.fullname})`);
}

console.log('\nSeed complete!');
await pool.end();
