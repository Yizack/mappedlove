import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

const date = Date.now();

const deleteUsers = (DB: BetterSQLite3Database) => {
  DB.delete(tables.users).run();
};

const insertUsers = (DB: BetterSQLite3Database, c: number) => {
  for (let i = 0; i < c; i++) {
    DB.insert(tables.users).values({
      id: i + 1,
      email: `test${i + 1}@test.test`,
      password: process.env.SEED as string,
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

const createBond = (DB: BetterSQLite3Database, partner1: number, partner2: number) => {
  const today = Date.now();
  DB.insert(tables.bonds).values({
    id: 1,
    partner1,
    partner2,
    code: "QDZV1",
    bonded: 1,
    premium: 0,
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
  deleteUsers(DB);
  insertUsers(DB, 2);
  createBond(DB, 1, 2);
  console.info("Database seeded");
};
