import request from "supertest";
import { buildApp } from "../../src/app";
import { createContainer } from "../../src/di/createContainer";

describe("Users HTTP", () => {
  it("GET /api/users returns 200 and an array", async () => {
    const app = buildApp(createContainer());
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/users creates a user", async () => {
    const app = buildApp(createContainer());
    const res = await request(app)
      .post("/api/users")
      .send({ name: "Ada", email: "ada@math.org" })
      .set("content-type", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "Ada", email: "ada@math.org" });
    expect(res.body.id).toBeTruthy();
  });

  it("GET /api/users/:id returns 404 for missing user", async () => {
    const app = buildApp(createContainer());
    const res = await request(app).get("/api/users/does-not-exist");
    expect(res.status).toBe(404);
    expect(typeof res.body.error).toBe("string");
    expect(res.body.error).toContain("not found");
  });
});
