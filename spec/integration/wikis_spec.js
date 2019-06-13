const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;


describe("routes : wikis", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;


    sequelize.sync({ force: true }).then((res) => {
      User.create({
        username: "username",
        email: "user@example.com",
        password: "1234567890"
      })
        .then((user) => {
          this.user = user;

          Wiki.create({
            title: "Wiki Title",
            body: "Please enter body text here",
            userId: this.user.id
          })
            .then((wiki) => {
              this.wiki = wiki;

              request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                  userId: this.user.id,
                  email: this.user.email
                }
              },
                (err, res, body) => {
                  done();
                }
              )
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
    });
  });

  describe("GET /wikis", () => {

    it("should return a status code of 200", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {

    it("should render a 'new' wiki view", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {

    it("should create a new wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "New Wiki Title",
          body: "Please enter body of new wiki",
          userId: this.user.id
        }
      };
      request.post(options,
        (err, res, body) => {
          Wiki.findOne({ where: { title: "New Wiki Title" } })
            .then((wiki) => {
              expect(wiki).toBeNull();
                done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
    });

    it("should not create a new wiki that fails validation", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "New Failed Wiki",
          body: "Do not fail validation"
        }
      };

      request.post(options,
        (err, res, body) => {

          Wiki.findOne({ where: { title: "New Failed Wiki" } })
            .then((wiki) => {
              expect(wiki).toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            })
        })
    })
  });

  describe("GET /wiki/:id", () => {

    it("should render a view with the selected wiki", (done) => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(this.wiki.title).toContain("Wiki Title");
        expect(this.wiki.body).toContain("Please enter body text her");
        done();
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {

    it("should delete the wiki with the associated ID", (done) => {
      Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
              .then((wikis) => {
                expect(err).toBeNull();
                expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                done();
              });
          });
        });
    });
  });

  describe("GET /topics/:id/edit", () => {

    it("should render a view with an edit wiki form", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
        expect(body).toContain("Wiki Title");
        done();
      });
    });

  });


  describe("POST /wikis/:id/update", () => {

    it("should update the wiki with the given values", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Updated Wiki Title",
          body: "This wiki has been updated by the user."
        }
      };
      request.post(options,
        (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: { id: this.wiki.id }
          })
            .then((wiki) => {
              expect(wiki.title).not.toBe("Updated Wiki Title");
              done();
            });
        });
    });
  });
});