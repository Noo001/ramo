import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "menu");
const OUTPUT_JSON = path.join(process.cwd(), "scripts", "yandex-menu.json");
const API_RESPONSES = path.join(process.cwd(), "scripts", "yandex-api-responses.json");

interface ParsedDish {
  name: string;
  description: string;
  price: number;
  weight: string;
  imageUrl: string | null;
  category: string;
}

function getImageUrl(uri: string | undefined): string | null {
  if (!uri) return null;
  const url = uri.replace("{w}x{h}", "400x400");
  return url.startsWith("http") ? url : `https://eda.yandex${url}`;
}

async function downloadImage(url: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return `/images/menu/${filename}`;
  } catch (error) {
    console.error("Download image error:", error);
    return null;
  }
}

async function parseFromApiResponses() {
  if (!fs.existsSync(API_RESPONSES)) {
    console.error("API responses not found. Run playwright parse first.");
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const responses = JSON.parse(fs.readFileSync(API_RESPONSES, "utf8"));
  const menuResponse = responses.find((r: any) => r.url.includes("/api/v2/menu/retrieve/ramo"));

  if (!menuResponse) {
    console.error("Menu API response not found");
    return;
  }

  const data = JSON.parse(menuResponse.body);
  const categories = data.payload?.categories || [];

  const dishes: ParsedDish[] = [];

  categories.forEach((category: any) => {
    const categoryName = category.name;
    const items = category.items || [];

    items.forEach((item: any) => {
      dishes.push({
        name: item.name,
        description: item.description || "",
        price: item.price || 0,
        weight: item.weight || "",
        imageUrl: getImageUrl(item.picture?.uri),
        category: categoryName,
      });
    });
  });

  console.log(`Found ${dishes.length} dishes`);

  // Download images
  const processedDishes = [];
  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    let localImage = null;
    if (dish.imageUrl) {
      const ext = dish.imageUrl.split("?")[0].split(".").pop() || "jpg";
      const filename = `dish_${i}.${ext}`;
      localImage = await downloadImage(dish.imageUrl, filename);
      if (localImage) {
        console.log(`Downloaded: ${dish.name}`);
      }
    }
    processedDishes.push({ ...dish, localImage });
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(processedDishes, null, 2));
  console.log(`Saved ${processedDishes.length} dishes to ${OUTPUT_JSON}`);
}

parseFromApiResponses().catch((error) => {
  console.error("Parse error:", error);
  process.exit(1);
});
