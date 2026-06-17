export type Identifiable = {
  id: string;
};

type CreateInput<T extends Identifiable> = Omit<T, "id"> &
  Partial<Pick<T, "id">>;

function isBrowser() {
  return typeof window !== "undefined" || typeof document !== "undefined";
}

export function createMockCrudStore<T extends Identifiable>(
  initialItems: T[] = [],
) {
  // Lazy-initialize only in browser to avoid SSR/hydration mismatch.
  // Module-level state runs at import time on the server in SSR mode,
  // causing data leakage and hydration errors.
  let items: T[] | null = null;

  function getItems(): T[] {
    if (items === null) {
      items = initialItems.map(clone);
    }
    return items;
  }

  return {
    async getItems() {
      return getItems().map(clone);
    },

    async getItemById(id: string) {
      const item = getItems().find((value) => value.id === id);
      return item ? clone(item) : null;
    },

    async createItem(data: CreateInput<T>) {
      if (items === null) {
        items = initialItems.map(clone);
      }
      const item = {
        ...data,
        id: data.id ?? createId(),
      } as T;
      items = [item, ...items];
      return clone(item);
    },

    async updateItem(id: string, data: Partial<T>) {
      const list = getItems();
      const index = list.findIndex((value) => value.id === id);
      if (index === -1) return null;
      list[index] = { ...list[index], ...data, id };
      return clone(list[index]);
    },

    async deleteItem(id: string) {
      const list = getItems();
      const before = list.length;
      items = list.filter((value) => value.id !== id);
      return items.length !== before;
    },

    replaceItems(nextItems: T[]) {
      items = nextItems.map(clone);
    },
  };
}

export function createId(prefix = "mock") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}
