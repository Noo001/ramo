"use client";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const STORAGE_KEY = "ramo-utm";

export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const search = new URLSearchParams(window.location.search);
    const fromUrl: UtmParams = {
      utm_source: search.get("utm_source") || undefined,
      utm_medium: search.get("utm_medium") || undefined,
      utm_campaign: search.get("utm_campaign") || undefined,
    };

    if (fromUrl.utm_source || fromUrl.utm_medium || fromUrl.utm_campaign) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return {};
}

export function getUtmBody() {
  const utm = getUtmParams();
  return {
    utmSource: utm.utm_source,
    utmMedium: utm.utm_medium,
    utmCampaign: utm.utm_campaign,
  };
}

export function clearUtmParams() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
