import "./setup.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../src/app.js";
import { credentials } from "./setup.js";

const app = createApp();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("POST /api/auth/login", () => {
  it("rejects missing credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });

  it("rejects wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: credentials.admin.username, password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("logs in admin and returns role", async () => {
    const res = await request(app).post("/api/auth/login").send(credentials.admin);
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.role).toBe("admin");
  });

  it("logs in second user with role user", async () => {
    const res = await request(app).post("/api/auth/login").send(credentials.user);
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("user");
  });
});

describe("protected routes", () => {
  it("rejects requests without a token", async () => {
    const res = await request(app).get("/api/transports");
    expect(res.status).toBe(401);
  });

  it("rejects requests with an invalid token", async () => {
    const res = await request(app).get("/api/transports").set("Authorization", "Bearer garbage");
    expect(res.status).toBe(401);
  });

  it("allows requests with a valid token", async () => {
    const login = await request(app).post("/api/auth/login").send(credentials.admin);
    const res = await request(app)
      .get("/api/transports")
      .set("Authorization", `Bearer ${login.body.data.token}`);
    expect(res.status).toBe(200);
  });
});
