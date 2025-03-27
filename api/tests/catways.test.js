const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);

const expect = chai.expect;

let tokenAdmin;

// Identifiants valides pour un admin
const credentials = {
  email: "admin_test@exemple.fr",
  password: "Azerty123"
};

describe("Tests Catways", () => {
  before(done => {
    chai.request(app)
      .post("/users/login")
      .send(credentials)
      .end((err, res) => {
        tokenAdmin = res.body.token;
        done();
      });
  });

  it("Refuser l'accès à /catways/api sans token", done => {
    chai.request(app)
      .get("/catways/api")
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("Permettre l'accès à /catways/api avec token", done => {
    chai.request(app)
      .get("/catways/api")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("catways");
        done();
      });
  });

  it("Ajouter un nouveau catway", done => {
    const newCatway = {
      catwayNumber: 99,
      type: "short",
      catwayState: "bon état"
    };

    chai.request(app)
      .post("/catways")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(newCatway)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("catwayNumber", 99);
        done();
      });
  });

  it("Supprimer un catway", done => {
    chai.request(app)
      .delete("/catways/99")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });
});
