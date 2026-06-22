import { prisma } from "../lib/prisma";
import fs from "fs";

async function main() {
  const cats = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { dishes: { orderBy: { id: "asc" } } },
  });

  const data = cats.map((c) => ({
    name: c.name,
    sortOrder: c.sortOrder,
    dishes: c.dishes.map((d) => ({
      name: d.name,
      description: d.description,
      price: d.price,
      weight: d.weight,
      image: d.image,
      isActive: d.isActive,
      isStopListed: d.isStopListed,
    })),
  }));

  fs.writeFileSync("prisma/seed-data.json", JSON.stringify(data, null, 2));
  console.log("seed-data.json written");
}

main().finally(async () => {
  await prisma.$disconnect();
});
