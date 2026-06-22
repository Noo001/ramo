import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";

interface ParsedDish {
  name: string;
  description: string;
  price: number;
  weight: string;
  imageUrl: string | null;
  localImage: string | null;
  category: string;
}

async function importMenu() {
  const filePath = path.join(process.cwd(), "scripts", "yandex-menu.json");
  const dishes: ParsedDish[] = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Group by category
  const byCategory = new Map<string, ParsedDish[]>();
  dishes.forEach((dish) => {
    if (!byCategory.has(dish.category)) {
      byCategory.set(dish.category, []);
    }
    byCategory.get(dish.category)!.push(dish);
  });

  let order = 1;
  for (const [categoryName, categoryDishes] of byCategory) {
    // Skip empty / promo categories
    if (categoryDishes.length === 0) continue;

    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        sortOrder: order++,
      },
    });

    for (const dish of categoryDishes) {
      await prisma.dish.upsert({
        where: {
          name: dish.name,
        },
        update: {
          description: dish.description || null,
          price: dish.price,
          weight: dish.weight || null,
          image: dish.localImage,
          categoryId: category.id,
          isActive: true,
          isStopListed: false,
        },
        create: {
          name: dish.name,
          description: dish.description || null,
          price: dish.price,
          weight: dish.weight || null,
          image: dish.localImage,
          categoryId: category.id,
          isActive: true,
          isStopListed: false,
        },
      });
    }

    console.log(`Imported ${categoryDishes.length} dishes to "${categoryName}"`);
  }

  console.log("Import completed");
}

importMenu()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
