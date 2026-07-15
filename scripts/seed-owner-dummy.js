const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/password');

const prisma = new PrismaClient();

const OWNER_COUNT = 30;
const DEFAULT_PASSWORD = 'owner123';

const firstNames = [
  'Adi',
  'Aji',
  'Andi',
  'Anisa',
  'Aulia',
  'Bagas',
  'Bayu',
  'Cahya',
  'Dewi',
  'Dimas',
  'Dinda',
  'Fajar',
  'Farhan',
  'Fitri',
  'Hana',
  'Iqbal',
  'Kartika',
  'Laras',
  'Maya',
  'Nadia',
  'Nanda',
  'Prasetyo',
  'Putri',
  'Rafli',
  'Rani',
  'Rizky',
  'Salsa',
  'Teguh',
  'Wahyu',
  'Yusuf',
];

const lastNames = [
  'Saputra',
  'Pratama',
  'Wijaya',
  'Permata',
  'Maharani',
  'Kusuma',
  'Hidayat',
  'Ramadhan',
  'Lestari',
  'Pangestu',
  'Setiawan',
  'Utami',
  'Maulana',
  'Nugroho',
  'Sari',
  'Febrianto',
  'Wibowo',
  'Kurniawan',
  'Puspitasari',
  'Anggraini',
];

const streetNames = [
  'Melati',
  'Kenanga',
  'Flamboyan',
  'Anggrek',
  'Bougenville',
  'Pahlawan',
  'Merdeka',
  'Sudirman',
  'Diponegoro',
  'Majapahit',
  'Gatot Subroto',
  'Ahmad Yani',
  'Cempaka',
  'Mangga',
  'Raya Kampus',
];

const districts = [
  'Coblong',
  'Sukajadi',
  'Lowokwaru',
  'Depok',
  'Banyumanik',
  'Kuta Utara',
  'Tegalrejo',
  'Ilir Timur II',
  'Panakkukang',
  'Samarinda Ulu',
  'Banjarsari',
  'Pontianak Kota',
];

const cities = [
  'Bandung',
  'Jakarta',
  'Bogor',
  'Depok',
  'Tangerang',
  'Bekasi',
  'Yogyakarta',
  'Semarang',
  'Surabaya',
  'Malang',
  'Denpasar',
  'Makassar',
];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildOwnerProfile(index) {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[(index * 3) % lastNames.length];
  const city = cities[index % cities.length];
  const district = districts[(index * 2) % districts.length];
  const street = streetNames[(index * 5) % streetNames.length];
  const fullName = `${firstName} ${lastName}`;
  const slug = `${slugify(fullName)}-${slugify(city)}-${String(index + 1).padStart(2, '0')}`;
  const email = `${slug}@owner.ecoshare.id`;
  const phone = `08${String(1110000000 + index * 7913).slice(0, 10)}`;
  const address = `Jl. ${street} No. ${index + 7}, ${district}, ${city}`;

  return {
    fullName,
    email,
    phone,
    address,
  };
}

async function main() {
  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
  const ownerProfiles = Array.from({ length: OWNER_COUNT }, (_, index) => buildOwnerProfile(index));
  const candidateEmails = ownerProfiles.map((owner) => owner.email);

  const existingOwners = await prisma.user.findMany({
    where: {
      email: {
        in: candidateEmails,
      },
    },
    select: {
      email: true,
    },
  });

  const existingEmailSet = new Set(existingOwners.map((owner) => owner.email));
  const ownersToCreate = ownerProfiles
    .filter((owner) => !existingEmailSet.has(owner.email))
    .map((owner) => ({
      name: owner.fullName,
      email: owner.email,
      password: hashedPassword,
      role: 'OWNER',
    }));

  if (ownersToCreate.length > 0) {
    await prisma.user.createMany({
      data: ownersToCreate,
      skipDuplicates: true,
    });
  }

  await prisma.user.updateMany({
    where: {
      email: {
        in: candidateEmails,
      },
    },
    data: {
      role: 'OWNER',
    },
  });

  const totalMatchingOwners = await prisma.user.count({
    where: {
      email: {
        in: candidateEmails,
      },
      role: 'OWNER',
    },
  });

  console.log(JSON.stringify({
    requested: OWNER_COUNT,
    inserted: ownersToCreate.length,
    skipped: OWNER_COUNT - ownersToCreate.length,
    totalMatchingOwners,
    enforcedRole: 'OWNER',
    defaultPassword: DEFAULT_PASSWORD,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
