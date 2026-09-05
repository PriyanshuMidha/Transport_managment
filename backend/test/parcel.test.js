import "./setup.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../src/app.js";
import { Transport } from "../src/models/Transport.js";
import { credentials } from "./setup.js";

const app = createApp();
let adminToken;
let userToken;
let transportId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const transport = await Transport.create({ name: "TestTransport", normalizedName: "testtransport" });
  transportId = transport._id.toString();

  const adminLogin = await request(app).post("/api/auth/login").send(credentials.admin);
  adminToken = adminLogin.body.data.token;

  const userLogin = await request(app).post("/api/auth/login").send(credentials.user);
  userToken = userLogin.body.data.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

const validPayload = () => ({
  date: "2026-01-01",
  supplierName: "Acme",
  receiverName: "Bob",
  transportId,
  billNumber: "B1",
  builtyNumber: "BT1",
  lotNumber: "L1",
});

describe("POST /api/parcels", () => {
  it("rejects missing required fields", async () => {
    const res = await request(app)
      .post("/api/parcels")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("rejects an invalid transportId", async () => {
    const res = await request(app)
      .post("/api/parcels")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...validPayload(), transportId: "not-a-valid-id" });
    expect(res.status).toBe(400);
  });

  it("creates a parcel with createdBy set from the token", async () => {
    const res = await request(app)
      .post("/api/parcels")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(validPayload());
    expect(res.status).toBe(201);
    expect(res.body.data.createdBy).toBe(credentials.admin.username);
    expect(res.body.data.status).toBe("IN_STOCK");
  });
});

describe("delete access control", () => {
  let parcelId;

  beforeAll(async () => {
    const created = await request(app)
      .post("/api/parcels")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(validPayload());
    parcelId = created.body.data._id;

    await request(app)
      .patch(`/api/parcels/${parcelId}/open`)
      .set("Authorization", `Bearer ${adminToken}`);
  });

  it("blocks a non-admin user from deleting", async () => {
    const res = await request(app)
      .delete(`/api/parcels/${parcelId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ confirmPassword: credentials.deletePassword });
    expect(res.status).toBe(403);
  });

  it("blocks admin delete with wrong confirm password", async () => {
    const res = await request(app)
      .delete(`/api/parcels/${parcelId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ confirmPassword: "wrong" });
    expect(res.status).toBe(401);
  });

  it("allows admin delete with correct confirm password", async () => {
    const res = await request(app)
      .delete(`/api/parcels/${parcelId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ confirmPassword: credentials.deletePassword });
    expect(res.status).toBe(200);
  });
});
