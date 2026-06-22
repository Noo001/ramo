import { PrismaClient, TableZone } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { login: "admin" },
    update: {},
    create: {
      login: "admin",
      passwordHash: adminPassword,
    },
  });

  // Tables: id = table number, globally unique
  const tables: { id: number; zone: TableZone; seats: number }[] = [];
  let tableId = 1;
  for (let i = 1; i <= 6; i++) {
    tables.push({ id: tableId++, zone: TableZone.HALL1, seats: 4 });
  }
  for (let i = 1; i <= 4; i++) {
    tables.push({ id: tableId++, zone: TableZone.HALL2, seats: 4 });
  }
  for (let i = 1; i <= 4; i++) {
    tables.push({ id: tableId++, zone: TableZone.TERRACE, seats: 4 });
  }

  await prisma.table.deleteMany({});
  await prisma.table.createMany({
    data: tables,
  });

  // Default settings
  const defaultSettings = [
    { key: "telegramBotToken", value: "" },
    { key: "telegramChatId", value: "" },
    { key: "iikoApiLogin", value: "" },
    { key: "iikoOrganizationId", value: "" },
    { key: "loyaltyEarnPercent", value: "5" },
    { key: "loyaltySpendPercent", value: "30" },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
