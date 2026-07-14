const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.rentalHistory.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'Owner Test',
        email: 'owner1778599230651@example.com',
        password: '$2b$10$cfbLR64a9E5sADEqwdoDOOOZJO.hzMJ58VMp/E2M7/34UvfsCxFG2',
        role: 'OWNER',
        createdAt: new Date('2026-05-12T08:20:31.000Z'),
        updatedAt: new Date('2026-05-12T08:20:31.000Z'),
      },
      {
        id: 2,
        name: 'Other Owner Test',
        email: 'other-owner1778599230651@example.com',
        password: '$2b$10$tJWl6VIZbp.5FDQUUy9U2OF.4CMiyKNe401xG9TV4l77.UpR1vSZ.',
        role: 'OWNER',
        createdAt: new Date('2026-05-12T08:20:32.000Z'),
        updatedAt: new Date('2026-05-12T08:20:32.000Z'),
      },
      {
        id: 3,
        name: 'Renter Test',
        email: 'renter1778599230651@example.com',
        password: '$2b$10$YoFzFHcXmVyaS9bRUfOfI.A/hoXaN3IR/S9JfozCUhKxzcx.9Yvl6',
        role: 'RENTER',
        createdAt: new Date('2026-05-12T08:20:33.000Z'),
        updatedAt: new Date('2026-05-12T08:20:33.000Z'),
      },
    ],
  });

  await prisma.item.create({
    data: {
      id: 1,
      ownerId: 1,
      name: 'Laptop Test 1778599230651',
      description: 'Laptop testing layak pakai',
      category: 'Laptop',
      dailyPrice: '50000.00',
      stock: 1,
      status: 'AVAILABLE',
      createdAt: new Date('2026-05-12T08:20:34.000Z'),
      updatedAt: new Date('2026-05-12T08:20:36.000Z'),
    },
  });

  await prisma.rental.create({
    data: {
      id: 1,
      renterId: 3,
      itemId: 1,
      quantity: 1,
      startDate: new Date('2025-12-31T17:00:00.000Z'),
      endDate: new Date('2026-01-02T17:00:00.000Z'),
      totalPrice: '100000.00',
      status: 'ACTIVE',
      createdAt: new Date('2026-05-12T08:20:37.000Z'),
      updatedAt: new Date('2026-05-12T08:20:37.000Z'),
      histories: {
        create: [
          {
            id: 1,
            action: 'CREATED',
            note: 'Rental dibuat dan stok barang dikurangi',
            createdAt: new Date('2026-05-12T08:20:37.000Z'),
          },
        ],
      },
    },
  });

  const counts = {
    users: await prisma.user.count(),
    items: await prisma.item.count(),
    rentals: await prisma.rental.count(),
    histories: await prisma.rentalHistory.count(),
  };

  console.log(JSON.stringify(counts, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
