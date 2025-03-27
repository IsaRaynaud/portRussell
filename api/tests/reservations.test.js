require("dotenv").config({ path: "./env/.env" });
const chai = require("chai");
chai.should();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const mongodb = require("../db/mongo");
const Catway = require("../models/catway");
const Reservation = require("../models/reservation");

let tokenAdmin;
let tokenClient;
let testCatway;
let testReservationId;

describe("Réservations pontons", () => {
  before(async () => {
    await mongodb.initClientDbConnection();

    const login = async (email, password) => {
        const res = await request(app).post("/users/login").send({ email, password });
        return res.body.token;
      };
      tokenAdmin = await login("admin_test@exemple.fr", "Azerty123");
      tokenClient = await login("client_test@exemple.fr", "123Azerty");

    testCatway = await Catway.create({
      catwayNumber: 99,
      type: "short",
      catwayState: "bon état",
    });
  });

  after(async () => {
    await Reservation.deleteMany({ catwayNumber: 99 });
    await Catway.deleteOne({ catwayNumber: 99 });
    await mongoose.connection.close();
  });

  it("Ajout de réservation avec token client", async () => {
    const res = await request(app)
      .post(`/catways/${testCatway.catwayNumber}/reservations`)
      .set("Authorization", `Bearer ${tokenClient}`)
      .send({
        clientName: "Jean Test",
        boatName: "BateauTest",
        checkIn: new Date(),
        checkOut: new Date(Date.now() + 2 * 86400000),
      });

    testReservationId = res.body._id;

    if (res.status !== 201) console.log(res.body);
    
    res.should.have.status(201);
    res.body.should.have.property("clientName", "Jean Test");
  });

  it("Récupération des réservations du catway", async () => {
    const res = await request(app)
      .get(`/catways/${testCatway.catwayNumber}/reservations/api`)
      .set("Authorization", `Bearer ${tokenClient}`);

    res.should.have.status(200);
    res.body.reservations.should.be.an("array");
  });

  it("Suppression de la réservation avec token admin", async () => {
    const res = await request(app)
      .delete(`/catways/${testCatway.catwayNumber}/reservations/${testReservationId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    res.should.have.status(204);
  });
});
