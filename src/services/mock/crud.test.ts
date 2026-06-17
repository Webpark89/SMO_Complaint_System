import { describe, expect, it } from "vitest";
import { createMockCrudStore } from "../crud";

type Item = { id: string; name: string };

describe("createMockCrudStore", () => {
  it("returns empty array when no initial items", async () => {
    const store = createMockCrudStore<Item>();
    const items = await store.getItems();
    expect(items).toEqual([]);
  });

  it("initializes with provided items", async () => {
    const store = createMockCrudStore<Item>([{ id: "1", name: "alpha" }]);
    const items = await store.getItems();
    expect(items).toEqual([{ id: "1", name: "alpha" }]);
  });

  it("createItem adds to store", async () => {
    const store = createMockCrudStore<Item>();
    const created = await store.createItem({ name: "beta" });
    expect(created.name).toBe("beta");
    expect(created.id).toBeTruthy();

    const items = await store.getItems();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe("beta");
  });

  it("getItemById returns correct item", async () => {
    const store = createMockCrudStore<Item>([
      { id: "a", name: "first" },
      { id: "b", name: "second" },
    ]);
    const item = await store.getItemById("b");
    expect(item?.name).toBe("second");
  });

  it("getItemById returns null for unknown id", async () => {
    const store = createMockCrudStore<Item>();
    const item = await store.getItemById("does-not-exist");
    expect(item).toBeNull();
  });

  it("updateItem modifies existing item", async () => {
    const store = createMockCrudStore<Item>([{ id: "x", name: "old" }]);
    const updated = await store.updateItem("x", { name: "new" });
    expect(updated?.name).toBe("new");

    const items = await store.getItems();
    expect(items.find((i) => i.id === "x")?.name).toBe("new");
  });

  it("deleteItem removes item", async () => {
    const store = createMockCrudStore<Item>([
      { id: "1", name: "keep" },
      { id: "2", name: "remove" },
    ]);
    const deleted = await store.deleteItem("2");
    expect(deleted).toBe(true);

    const items = await store.getItems();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("1");
  });

  it("replaceItems replaces all items", async () => {
    const store = createMockCrudStore<Item>([{ id: "old", name: "old" }]);
    store.replaceItems([{ id: "new", name: "new" }]);

    const items = await store.getItems();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("new");
  });

  it("getItems returns a copy (mutation-safe)", async () => {
    const store = createMockCrudStore<Item>([{ id: "1", name: "original" }]);
    const items = await store.getItems();
    items[0].name = "mutated";

    const fresh = await store.getItems();
    expect(fresh[0].name).toBe("original");
  });
});
