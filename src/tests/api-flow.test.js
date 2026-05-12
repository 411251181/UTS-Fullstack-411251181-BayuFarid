const request = require('supertest');
const app = require('../app');
const prisma = require('../config/database');

const unique = Date.now();
const ownerEmail = `owner${unique}@example.com`;
const otherOwnerEmail = `other-owner${unique}@example.com`;
const renterEmail = `renter${unique}@example.com`;

let ownerToken;
let otherOwnerToken;
let renterToken;
let itemId;

const registerAndLogin = async ({ name, email, role }) => {
  await request(app)
    .post('/api/v1/auth/register')
    .send({ name, email, password: 'password123', role })
    .expect((res) => {
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'password123' })
    .expect(200);

  return loginResponse.body.data.token;
};

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Eco-Share API flow', () => {
  test('protected endpoint without token should fail', async () => {
    const response = await request(app).get('/api/v1/auth/me').expect(401);
    expect(response.body.success).toBe(false);
  });

  test('register and login users', async () => {
    ownerToken = await registerAndLogin({ name: 'Owner Test', email: ownerEmail, role: 'OWNER' });
    otherOwnerToken = await registerAndLogin({ name: 'Other Owner Test', email: otherOwnerEmail, role: 'OWNER' });
    renterToken = await registerAndLogin({ name: 'Renter Test', email: renterEmail, role: 'RENTER' });

    expect(ownerToken).toBeDefined();
    expect(otherOwnerToken).toBeDefined();
    expect(renterToken).toBeDefined();
  });

  test('owner can create item', async () => {
    const response = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: `Laptop Test ${unique}`,
        description: 'Laptop testing layak pakai',
        category: 'Laptop',
        dailyPrice: 50000,
        stock: 2,
        status: 'AVAILABLE',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    itemId = response.body.data.id;
  });

  test('renter can list and detail item', async () => {
    const listResponse = await request(app).get('/api/v1/items').expect(200);
    expect(listResponse.body.success).toBe(true);

    const detailResponse = await request(app).get(`/api/v1/items/${itemId}`).expect(200);
    expect(detailResponse.body.data.id).toBe(itemId);
  });

  test('other owner cannot update item owned by another owner', async () => {
    const response = await request(app)
      .put(`/api/v1/items/${itemId}`)
      .set('Authorization', `Bearer ${otherOwnerToken}`)
      .send({ name: 'Illegal Update' })
      .expect(403);

    expect(response.body.success).toBe(false);
  });

  test('renter can create rental and stock decreases', async () => {
    const rentalResponse = await request(app)
      .post('/api/v1/rentals')
      .set('Authorization', `Bearer ${renterToken}`)
      .send({
        itemId,
        quantity: 1,
        startDate: '2026-01-01',
        endDate: '2026-01-03',
      })
      .expect(201);

    expect(rentalResponse.body.success).toBe(true);
    expect(Number(rentalResponse.body.data.totalPrice)).toBe(100000);

    const itemResponse = await request(app).get(`/api/v1/items/${itemId}`).expect(200);
    expect(itemResponse.body.data.stock).toBe(1);
  });

  test('rental with insufficient stock should fail', async () => {
    const response = await request(app)
      .post('/api/v1/rentals')
      .set('Authorization', `Bearer ${renterToken}`)
      .send({
        itemId,
        quantity: 99,
        startDate: '2026-01-01',
        endDate: '2026-01-03',
      })
      .expect(409);

    expect(response.body.success).toBe(false);
  });
});
