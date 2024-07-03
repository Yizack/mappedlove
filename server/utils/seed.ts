const DB = useDb();
const date = Date.now();
const testPassword = process.env.TEST_PASSWORD;
const testEmail = process.env.TEST_EMAIL;

const insertTestUsers = (c: number) => {
  for (let i = 0; i < c; i++) {
    DB.insert(tables.users).values({
      id: i + 1,
      email: i === 0 && testEmail ? testEmail : `test${i + 1}@test.test`,
      password: testPassword ? hash(testPassword, useRuntimeConfig().secure.salt) : null,
      name: `Name${i + 1}`,
      country: null,
      birthDate: null,
      showAvatar: 0,
      confirmed: 1,
      createdAt: date,
      updatedAt: date
    }).run();
  }
};

const createTestBond = (partner1: number, partner2: number) => {
  DB.insert(tables.bonds).values({
    id: 1,
    partner1,
    partner2,
    code: "QDZV1",
    bonded: 1,
    premium: 0,
    createdAt: date,
    updatedAt: date
  }).onConflictDoUpdate({
    target: tables.bonds.id,
    set: {
      partner1,
      partner2
    }
  }).run();
};

export const seedDev = () => {
  DB.delete(tables.users).run();
  insertTestUsers(2);
  createTestBond(1, 2);
  console.info("Database seeded");
};
