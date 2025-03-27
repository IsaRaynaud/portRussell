require("dotenv").config({ path: "./env/.env" });
const chai = require("chai");
const chaiHttp = require("chai-http");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const mongodb = require("../db/mongo");

chai.use(chaiHttp);
chai.should();

let userId;

describe("Gestion des utilisateurs", () => {
    before(async () => {
        await mongodb.initClientDbConnection();

        const loginRes = await request(app).post("/users/login").send({
            email: "admin_test@exemple.fr",
            password: "Azerty123"
          });
        
          adminToken = loginRes.body.token;
      });
    
      after(async () => {
        await mongoose.connection.close();
      });

  it("1. Ajout d'un nouvel utilisateur client", async () => {
    const uniqueEmail = `test_user_${Date.now()}@example.com`;

    const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("Accept", "application/json")
        .send({
        email: uniqueEmail,
        password: "123456",
        role: "client",
        clientName: "Client Test",
        boatName: "Test Boat"
      });

      if (res.status !== 201) console.log("Erreur:", res.body);
  
      res.should.have.status(201);
      res.body.should.have.property("user");
      userId = res.body.user._id;
    });

  it("2. Mise à jour du nom du bateau de l'utilisateur", async () => {
    if (!userId) return;

    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ boatName: "Nouveau Nom" });

    res.should.have.status(200);
    res.body.should.have.property("boatName", "Nouveau Nom");
  });

  it("3. Suppression de l'utilisateur créé", async () => {
    if (!userId) return;

    const res = await request(app).delete(`/users/${userId}`);
    res.should.have.status(200);
    res.body.should.have.property("message", "Utilisateur supprimé");
  });

  it("4. Récupération de la liste des utilisateurs (GET /users)", async () => {
    const res = await request(app).get("/users");
    res.should.have.status(200);
    res.text.should.include("<!DOCTYPE html>");
  });
});
