process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("./app");
const items = require("./fakeDb");

// Define a sample item
const item = { name: "new", price: 30 };

// Run this before each test
beforeEach(() => {
  items.push(item);
});

// Run this after each test
afterEach(() => {
  items.length = 0;
});

/** GET /items - returns `{items: [item, ...]}` */
describe("GET /items", () => {
  test("Gets a list of items", async () => {
    const response = await request(app).get("/items");
    const { items } = response.body;
    expect(response.statusCode).toBe(200);
    expect(items).toHaveLength(1);
  });
});

/** GET /items/[name] - return data about one item: `{item: item}` */
describe("GET /items/:name", () => {
  test("Gets a single item", async () => {
    const response = await request(app).get(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toEqual(item);
  });

  test("Responds with 404 if can't find item", async () => {
    const response = await request(app).get(`/items/nonexistent`);
    expect(response.statusCode).toBe(404);
  });
});

/** POST /items - create item from data; return `{item: item}` */
describe("POST /items", () => {
  test("Creates a new item", async () => {
    const newItem = { name: "Taco", price: 0 };
    const response = await request(app)
      .post("/items")
      .send(newItem);
    expect(response.statusCode).toBe(201);
    expect(response.body.item).toHaveProperty("name");
    expect(response.body.item).toHaveProperty("price");
    expect(response.body.item.name).toEqual(newItem.name);
    expect(response.body.item.price).toEqual(newItem.price);
  });
});

/** PATCH /items/[name] - update item; return `{item: item}` */
describe("PATCH /items/:name", () => {
  test("Updates a single item", async () => {
    const updatedItem = { name: "Troll" };
    const response = await request(app)
      .patch(`/items/${item.name}`)
      .send(updatedItem);
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toEqual(updatedItem);
  });

  test("Responds with 404 if can't find item", async () => {
    const response = await request(app).patch(`/api/items/nonexistent`);
    expect(response.statusCode).toBe(404);
  });
});

/** DELETE /items/[name] - delete item, return `{message: "item deleted"}` */
describe("DELETE /items/:name", () => {
  test("Deletes a single item", async () => {
    const response = await request(app).delete(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Deleted" });
  });
});
