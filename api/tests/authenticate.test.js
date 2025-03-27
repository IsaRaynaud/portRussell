const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
console.log("chai.request disponible ?", typeof chai.request);

const expect = chai.expect;

describe("Authentification et utilisateurs", () => {
  let token;

  it("1. Connexion avec un utilisateur admin valide", (done) => {
    chai
      .request(app)
      .post("/users/login")
      .send({ email: "admin_test@exemple.fr", password: "Azerty123" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        token = res.body.token;
        done();
      });
  });

  it("2. Accès protégé au tableau admin avec token", (done) => {
    chai
      .request(app)
      .get("/users/admin-data")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("3. Accès refusé sans token", (done) => {
    chai
      .request(app)
      .get("/users/admin-data")
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
