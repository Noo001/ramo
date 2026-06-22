import { PrismaClient, TableZone } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

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

  await prisma.eventRequest.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.reservation.deleteMany({});
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

  // Menu categories and dishes from seed-data.json
  const seedDataPath = path.join(__dirname, "seed-data.json");
  if (fs.existsSync(seedDataPath)) {
    const categories = JSON.parse(fs.readFileSync(seedDataPath, "utf-8")) as {
      name: string;
      sortOrder: number;
      dishes: {
        name: string;
        description: string | null;
        price: number;
        weight: string | null;
        image: string | null;
        isActive: boolean;
        isStopListed: boolean;
      }[];
    }[];

    await prisma.dish.deleteMany({});
    await prisma.category.deleteMany({});

    for (const category of categories) {
      const createdCategory = await prisma.category.create({
        data: {
          name: category.name,
          sortOrder: category.sortOrder,
        },
      });

      if (category.dishes.length > 0) {
        await prisma.dish.createMany({
          data: category.dishes.map((dish) => ({
            ...dish,
            categoryId: createdCategory.id,
          })),
        });
      }
    }
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
