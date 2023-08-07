import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

const date = Date.now();

const insertUsers = (DB: BetterSQLite3Database, c: number) => {
  DB.delete(tables.users).run();
  for (let i = 0; i < c; i++) {
    DB.insert(tables.users).values({
      email: `test${i+1}@test.test`,
      password: process.env.SEED as string,
      name: `Test${i+1}`,
      country: null,
      address: null,
      birthDate: null,
      showAvatar: 0,
      confirmCode: "123456",
      confirmed: 1,
      createdAt: date,
      updatedAt: date,
    }).run();
  }
};

const createBond = (DB: BetterSQLite3Database, partner1: number, partner2: number) => {
  const today = Date.now();
  DB.insert(tables.bonds).values({
    id: 1,
    partner1,
    partner2,
    code: "123",
    bonded: 1,
    createdAt: today,
    updatedAt: today
  }).onConflictDoUpdate({
    target: tables.bonds.id,
    set: {
      partner1,
      partner2
    }
  }).run();
};

export const seedDev = async (DB: BetterSQLite3Database) => {
  insertUsers(DB, 2);
  createBond(DB, 1, 2);
  console.info("Database seeded");
};