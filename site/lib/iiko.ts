const IIKO_BASE_URL = "https://api-ru.iiko.services";

export interface IikoGroup {
  id: string;
  name: string;
  isIncludedInMenu?: boolean;
}

export interface IikoProduct {
  id: string;
  name: string;
  description?: string;
  groupId?: string;
  isIncludedInMenu?: boolean;
  sizePrices?: { price?: { currentPrice?: number } }[];
  weight?: number;
  measureUnit?: string;
}

export interface IikoNomenclature {
  groups?: IikoGroup[];
  products?: IikoProduct[];
}

export async function getIikoToken(apiLogin: string): Promise<string> {
  const res = await fetch(`${IIKO_BASE_URL}/api/1/access_token?apiLogin=${encodeURIComponent(apiLogin)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iiko auth failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.token;
}

export async function getOrganizations(token: string) {
  const res = await fetch(`${IIKO_BASE_URL}/api/1/organizations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iiko organizations failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.organizations || [];
}

export async function getNomenclature(token: string, organizationId: string): Promise<IikoNomenclature> {
  const res = await fetch(`${IIKO_BASE_URL}/api/1/nomenclature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iiko nomenclature failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data;
}

export async function getStopList(token: string, organizationId: string) {
  const res = await fetch(`${IIKO_BASE_URL}/api/1/stop_lists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationIds: [organizationId] }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`iiko stop list failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  const items: { productId: string }[] = [];
  (data.stopList || []).forEach((org: { items?: { productId: string }[] }) => {
    if (org.items) items.push(...org.items);
  });
  return items;
}

export function getPrice(product: IikoProduct): number {
  if (!product.sizePrices || product.sizePrices.length === 0) return 0;
  const current = product.sizePrices[0].price?.currentPrice;
  return typeof current === "number" ? Math.round(current) : 0;
}

export function formatWeight(product: IikoProduct): string | null {
  if (typeof product.weight === "number" && product.weight > 0) {
    const unit = product.measureUnit || "г";
    return `${product.weight} ${unit}`;
  }
  return null;
}
