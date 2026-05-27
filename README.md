## Forum API

Project ini adalah backend API untuk aplikasi forum yang dirancang dengan prinsip clean architecture: use-case terpisah, repositori yang dapat diganti, dan infrastruktur terisolasi.

## Fitur Utama

- Pendaftaran dan login pengguna
- Auth berbasis JWT (access + refresh)
- CRUD thread dan komentar dengan authorisasi
- Laporkan/hapus komentar (moderasi)
- Migrations untuk PostgreSQL
- Struktur proyek yang siap diuji (Vitest)

## Teknologi

- Node.js
- Express (server HTTP)
- PostgreSQL (database)
- JWT untuk otentikasi
- Bcrypt untuk hashing password
- Vitest untuk testing

## Struktur Singkat

- [src/app.js](src/app.js#L1) — entrypoint server
- [src/Applications](src/Applications) — implementasi logika use-case
- [src/Interfaces/http/api] — route & middleware API
- [Infrastructures/database/postgres] — adapter DB dan repository
- [migrations/1627983516963_create-table-users.js](migrations/1627983516963_create-table-users.js#L1) — contoh skrip migrasi

## Quick Start (Local)

Prasyarat: Node.js LTS, PostgreSQL.

1. Install dependensi:

```bash
npm install
```

2. Setup environment (contoh `.env`):

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/forum_db
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret
```

3. Jalankan migrasi database (gunakan tool migrasi bawaan):

```bash
# contoh, sesuaikan dengan setup migrasi project
npm run migrate
```

4. Jalankan server:

```bash
npm start
```

5. Jalankan test suite:

```bash
npm test
```

## Endpoint Utama

- POST /users — daftar pengguna
- POST /authentications — login (menghasilkan access + refresh token)
- POST /threads — buat thread (auth)
- POST /threads/:threadId/comments — tambah komentar (auth)
- GET /threads/:threadId — detail thread + komentar

Contoh payload dan respons dapat ditemukan di kode sumber pada route terkait di [src/Interfaces/http/api](src/Interfaces/http/api#L1)

## Testing & Kualitas

- Gunakan `npm test` untuk menjalankan suite unit & integrasi (Vitest).
- Folder `src/*/_test` berisi unit test untuk use-case dan utilitas keamanan.

## Deployment

- Proyek ini siap dikontainerkan dengan Docker (Dockerfile dapat ditambahkan cepat).
- Siapkan variabel lingkungan untuk kunci JWT dan koneksi DB.
- Gunakan migrasi otomatis pada proses CI/CD sebelum menjalankan container.
