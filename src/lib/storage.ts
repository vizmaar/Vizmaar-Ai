const PREFIX = "vizmaar_";

export function saveToHistory<T>(key: string, item: T, maxItems = 20): void {
  if (typeof window === "undefined") return;
  try {
    const storageKey = `${PREFIX}history_${key}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]") as T[];
    const updated = [item, ...existing.filter((i) => JSON.stringify(i) !== JSON.stringify(item))].slice(0, maxItems);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch {
    // Storage unavailable or quota exceeded
  }
}

export function getHistory<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}history_${key}`) || "[]") as T[];
  } catch {
    return [];
  }
}

export function clearHistory(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${PREFIX}history_${key}`);
}

export function toggleFavorite(key: string, slug: string): boolean {
  if (typeof window === "undefined") return false;
  const storageKey = `${PREFIX}favorites_${key}`;
  const favorites = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]") as string[]);
  if (favorites.has(slug)) {
    favorites.delete(slug);
  } else {
    favorites.add(slug);
  }
  localStorage.setItem(storageKey, JSON.stringify([...favorites]));
  return favorites.has(slug);
}

export function getFavorites(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}favorites_${key}`) || "[]") as string[];
  } catch {
    return [];
  }
}

export function saveDraft<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PREFIX}draft_${key}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function loadDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${PREFIX}draft_${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
