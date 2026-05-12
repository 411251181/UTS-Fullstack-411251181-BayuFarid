# Eco-Share API

Backend API untuk platform penyewaan alat elektronik bekas **Eco-Share**. Aplikasi ini dibuat menggunakan Node.js, Express.js, Prisma ORM, JWT, bcrypt, dan MySQL.

## Fitur Saat Ini

- Struktur clean architecture: Route → Controller → Service → Repository.
- Auth register, login, dan profile `me`.
- JWT stateless authentication.
- Role user: `RENTER` dan `OWNER`.
- Password hashing dengan bcrypt.
- Global error handler.
- Response JSON konsisten.
- Prisma schema untuk users, items, rentals, dan rental histories.

## Tech Stack

- Node.js
- Express.js
- MySQL
- Prisma ORM
- JWT
- bcrypt
- express-validator
- Jest/Supertest

## Setup

1. Install dependency:

```sh
npm install
```

2. Salin env example:

```sh
cp .env.example .env
```

3. Isi `DATABASE_URL` di `.env` sesuai database MySQL lokal.

4. Generate Prisma client:

```sh
npm run prisma:generate
```

5. Jalankan migration:

```sh
npm run prisma:migrate
```

6. Jalankan server development:

```sh
npm run dev
```

Server berjalan di `http://localhost:3000` secara default.

## Endpoint

Prefix API: `/api/v1`

### Health

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET | `/` | Root API |
| GET | `/api/v1/health` | Health check |

### Auth

| Method | Endpoint | Akses | Keterangan |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | Public | Register user |
| POST | `/api/v1/auth/login` | Public | Login user |
| GET | `/api/v1/auth/me` | Authenticated | Ambil profil user login |

## Format Response

### Success

```json
{
  "success": true,
  "message": "Request berhasil",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Pesan error",
  "errors": []
}
```

## Roadmap / Checklist

### Phase 1 - Base Project, Prisma, Auth, Middleware

Status: IN PROGRESS

- [x] Setup package Node.js, Express, Prisma dependencies.
- [x] Buat Prisma schema untuk users, items, rentals, rental_histories.
- [x] Setup config env dan database Prisma.
- [x] Buat utility AppError, response JSON, JWT, bcrypt password.
- [x] Buat global error middleware.
- [x] Buat validate middleware.
- [x] Buat auth middleware JWT.
- [x] Buat role middleware.
- [x] Buat user repository.
- [x] Implement auth register, login, me.
- [x] Buat auth routes dan validation.
- [x] Buat app.js dan server.js.
- [x] Smoke test syntax/load app.
- [ ] Commit phase app bootstrap.

### Phase 2 - Items CRUD Owner

Status: TODO

- [ ] Item repository.
- [ ] Item service.
- [ ] Item controller.
- [ ] Item validation.
- [ ] Item routes.
- [ ] Ownership check update/delete.
- [ ] Commit phase item CRUD.

### Phase 3 - Rentals Transaction Flow

Status: TODO

- [ ] Rental repository.
- [ ] Rental service with database transaction.
- [ ] Atomic stock reduction.
- [ ] Rental history logging.
- [ ] Return rental.
- [ ] Cancel rental.
- [ ] Access guard renter/owner.
- [ ] Commit phase rental flow.

### Phase 4 - Tests and Docs

Status: TODO

- [ ] Auth tests/manual checklist.
- [ ] Item tests/manual checklist.
- [ ] Rental tests/manual checklist.
- [ ] README setup and endpoint documentation.
- [ ] Final review security and response consistency.
- [ ] Commit docs/tests phase.
