import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIikoToken, getNomenclature, getStopList, formatWeight, getPrice } from "@/lib/iiko";

export async function POST() {
  try {
    const apiLoginSetting = await prisma.setting.findUnique({ where: { key: "iikoApiLogin" } });
    const orgIdSetting = await prisma.setting.findUnique({ where: { key: "iikoOrganizationId" } });

    if (!apiLoginSetting?.value) {
      return NextResponse.json(
        { success: false, message: "Не указан API логин iiko. Добавьте его в настройках." },
        { status: 400 }
      );
    }

    const token = await getIikoToken(apiLoginSetting.value);

    let organizationId = orgIdSetting?.value;
    if (!organizationId) {
      const { getOrganizations } = await import("@/lib/iiko");
      const organizations = await getOrganizations(token);
      if (organizations.length === 0) {
        return NextResponse.json(
          { success: false, message: "Не найдены организации в iiko" },
          { status: 400 }
        );
      }
      organizationId = organizations[0].id;
      if (!organizationId) {
        return NextResponse.json(
          { success: false, message: "Не удалось определить Organization ID" },
          { status: 400 }
        );
      }
      await prisma.setting.upsert({
        where: { key: "iikoOrganizationId" },
        update: { value: organizationId },
        create: { key: "iikoOrganizationId", value: organizationId },
      });
    }

    const nomenclature = await getNomenclature(token, organizationId);
    const stopList = await getStopList(token, organizationId);
    const stopListProductIds = new Set(stopList.map((item) => item.productId));

    const menuGroups = nomenclature.groups?.filter((g) => g.isIncludedInMenu !== false) || [];
    const menuProducts = nomenclature.products?.filter((p) => p.isIncludedInMenu !== false) || [];

    let importedCategories = 0;
    let importedDishes = 0;
    let updatedDishes = 0;

    // Create categories
    const categoryMap = new Map<string, number>();
    for (let i = 0; i < menuGroups.length; i++) {
      const group = menuGroups[i];
      const category = await prisma.category.upsert({
        where: { iikoId: group.id },
        update: { name: group.name, sortOrder: i },
        create: { name: group.name, sortOrder: i, iikoId: group.id },
      });
      categoryMap.set(group.id, category.id);
      importedCategories++;
    }

    // Create/update dishes
    for (const product of menuProducts) {
      const categoryId = product.groupId ? categoryMap.get(product.groupId) : null;
      if (!categoryId) continue;

      const price = getPrice(product);
      if (price <= 0) continue;

      const existingDish = await prisma.dish.findUnique({ where: { iikoId: product.id } });

      const dishData = {
        name: product.name,
        description: product.description || null,
        price,
        weight: formatWeight(product),
        categoryId,
        isStopListed: stopListProductIds.has(product.id),
      };

      if (existingDish) {
        await prisma.dish.update({
          where: { id: existingDish.id },
          data: dishData,
        });
        updatedDishes++;
      } else {
        await prisma.dish.create({
          data: { ...dishData, iikoId: product.id, isActive: true },
        });
        importedDishes++;
      }
    }

    // Mark dishes not in iiko as inactive
    const iikoProductIds = new Set(menuProducts.map((p) => p.id).filter(Boolean));
    await prisma.dish.updateMany({
      where: {
        iikoId: { notIn: Array.from(iikoProductIds) as string[], not: null },
        isActive: true,
      },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: `Синхронизация завершена. Категорий: ${importedCategories}, новых блюд: ${importedDishes}, обновлено: ${updatedDishes}.`,
      importedCategories,
      importedDishes,
      updatedDishes,
    });
  } catch (error) {
    console.error("iiko sync error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Ошибка синхронизации: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
