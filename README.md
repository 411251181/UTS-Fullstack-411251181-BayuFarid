# Eco-Share API

Backend API untuk platform penyewaan alat elektronik bekas **Eco-Share**. Aplikasi ini dibuat menggunakan Node.js, Express.js, Prisma ORM, JWT, bcrypt, dan MySQL.

## Fitur

- Struktur clean architecture: Route → Controller → Service → Repository.
- Auth register, login, dan profile `me`.
- JWT stateless authentication.
- Role user: `RENTER` dan `OWNER`.
- Password hashing dengan bcrypt.
- CRUD barang untuk owner.
- Listing/detail barang tersedia untuk pengguna.
- Rental flow dengan database transaction.
- Atomic stock reduction saat rental dibuat.
- Rental history logging.
- Return dan cancel rental.
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

3. Isi `DATABASE_URL` di `.env` sesuai database MySQL lokal/VPS.

Contoh format:

```env
DATABASE_URL=mysql://user:password@host:port/ecoshare_db
JWT_SECRET=change_this_secret
```

4. Buat database jika belum ada:

```sh
npm run db:create
```

5. Generate Prisma client:

```sh
npm run prisma:generate
```

6. Jalankan migration:

```sh
npm run prisma:migrate
```

7. Jalankan server development:

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

#### Register Body

```json
{
  "name": "Owner User",
  "email": "owner@example.com",
  "password": "password123",
  "role": "OWNER"
}
```

#### Login Body

```json
{
  "email": "owner@example.com",
  "password": "password123"
}
```

Gunakan token login pada header:

```txt
Authorization: Bearer <token>
```

### Items

| Method | Endpoint | Akses | Keterangan |
| --- | --- | --- | --- |
| GET | `/api/v1/items` | Public | Ambil daftar barang tersedia |
| GET | `/api/v1/items/:id` | Public | Ambil detail barang |
| GET | `/api/v1/items/owner/my` | OWNER | Ambil barang milik owner login |
| POST | `/api/v1/items` | OWNER | Buat barang |
| PUT | `/api/v1/items/:id` | OWNER pemilik barang | Update barang |
| DELETE | `/api/v1/items/:id` | OWNER pemilik barang | Hapus barang jika belum dipinjam |

#### Create Item Body

```json
{
  "name": "Laptop Bekas",
  "description": "Laptop bekas layak pakai",
  "category": "Laptop",
  "dailyPrice": 50000,
  "stock": 3,
  "status": "AVAILABLE"
}
```

### Rentals

| Method | Endpoint | Akses | Keterangan |
| --- | --- | --- | --- |
| POST | `/api/v1/rentals` | RENTER | Buat rental dan kurangi stok |
| GET | `/api/v1/rentals/my` | RENTER | Ambil rental milik penyewa |
| GET | `/api/v1/rentals/owner` | OWNER | Ambil transaksi atas barang owner |
| GET | `/api/v1/rentals/:id` | RENTER terkait / OWNER barang terkait | Detail rental |
| PATCH | `/api/v1/rentals/:id/return` | RENTER terkait | Kembalikan barang dan tambah stok |
| PATCH | `/api/v1/rentals/:id/cancel` | RENTER terkait | Batalkan rental dan tambah stok |

#### Create Rental Body

```json
{
  "itemId": 1,
  "quantity": 1,
  "startDate": "2026-01-01",
  "endDate": "2026-01-03"
}
```

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

## Automated Test

Test API flow tersedia di `src/tests/api-flow.test.js` dan mencakup register/login, protected endpoint, item CRUD owner, ownership guard, rental sukses, stok berkurang, dan rental stok kurang.

Jalankan test:

```sh
npm test
```

## Export Database

Export database ke file SQL:

```sh
npm run db:export
```

File hasil export disimpan di `database/ecoshare_db.sql`.

## Manual Test Checklist

- [ ] Register user renter.
- [ ] Register user owner.
- [ ] Login user.
- [ ] Akses endpoint protected tanpa token harus gagal.
- [ ] Owner membuat barang.
- [ ] Renter melihat barang.
- [ ] Renter membuat rental dengan stok cukup.
- [ ] Stok barang berkurang setelah rental berhasil.
- [ ] Rental dengan stok tidak cukup harus gagal.
- [ ] User tidak boleh mengubah barang milik user lain.
- [ ] Response error konsisten.
- [ ] Transaction rollback jika proses rental gagal.

## Roadmap / Checklist

### Phase 1 - Base Project, Prisma, Auth, Middleware

Status: DONE

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
- [x] Commit phase app bootstrap.

### Phase 2 - Items CRUD Owner

Status: DONE

- [x] Item repository.
- [x] Item service.
- [x] Item controller.
- [x] Item validation.
- [x] Item routes.
- [x] Ownership check update/delete.
- [x] Commit phase item CRUD.

### Phase 3 - Rentals Transaction Flow

Status: DONE

- [x] Rental repository.
- [x] Rental service with database transaction.
- [x] Atomic stock reduction.
- [x] Rental history logging.
- [x] Return rental.
- [x] Cancel rental.
- [x] Access guard renter/owner.
- [x] Commit phase rental flow.

### Phase 4 - Tests and Docs

Status: IN PROGRESS

- [x] Auth tests/manual checklist.
- [x] Item tests/manual checklist.
- [x] Rental tests/manual checklist.
- [x] README setup and endpoint documentation.
- [x] Final review security and response consistency.
- [x] Commit docs/tests phase.
