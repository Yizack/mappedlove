const date = Date.now();
const testPassword = process.env.TEST_PASSWORD || "test";
const testEmail = process.env.TEST_EMAIL;

const insertTestUsers = async (c: number) => {
  for (let i = 0; i < c; i++) {
    await useDB().insert(tables.users).values({
      id: i + 1,
      email: i === 0 && testEmail ? testEmail : `test${i + 1}@test.test`,
      password: hash(testPassword, useRuntimeConfig().secure.salt),
      name: `Name${i + 1}`,
      country: null,
      birthDate: null,
      showAvatar: false,
      confirmed: true,
      createdAt: date,
      updatedAt: date
    }).run();
  }
};

const createTestBond = async (partner1: number, partner2: number) => {
  await useDB().insert(tables.bonds).values({
    id: 1,
    partner1,
    partner2,
    code: "QDZV1",
    bonded: true,
    premium: false,
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

export default defineTask({
  meta: {
    name: "db:seed",
    description: "Run database seed task"
  },
  async run () {
    await useDB().delete(tables.users).run();
    await insertTestUsers(2);
    await createTestBond(1, 2);
    console.info("Database seeded");
    return { result: "success" };
  }
});
