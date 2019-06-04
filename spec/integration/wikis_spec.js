const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/"
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        username: "lauraloo",
        email: "user@example.com",
        password: "password"
     })
     .then((user) => {
       this.user = user;
       Wiki.create({
        title: "Baseji",
        body: "They are known as the barkless dog",
        UserId: user.id
       })
       .then((wiki) => {
         this.wiki = wiki;
         done();
       })
     })
   });
  });

  describe("user trying to create a wiki", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/mock/auth",
        form: {
          role: this.user.role,
          userId: this.user.id,
          email: this.user.email
        }
      });
      done();
    });

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Basenji");
          done();
        });
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {
    it("should delete the wiki with the associated ID", (done) => {
      expect(this.wiki.id).toBe(1);

      request.post(`${base}/${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.findByPk(1)
        .then((wiki) => {
          expect(err).toBeNull();
          expect(wiki).toBeNull();
          done();
        })
      });
    });
  });
});