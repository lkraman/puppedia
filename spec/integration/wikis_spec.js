const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : wikis", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({ force: true }).then((res) => {
      User.create({
        username: "lauraloo",
        email: "lauraloo@example.com",
        password: "password"
      })
        .then((user) => {
          this.user = user;

          Wiki.create({
            title: "Basenji",
            body: "They are known as the barkless dog",
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
<<<<<<< HEAD

    it("should create a new wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Cats",
          body: "Cats can turn their ears 180 degrees",
          userId: this.user.id
        }
      };
      request.post(options,
        (err, res, body) => {
          Wiki.findOne({ where: { title: "Cats" } })
            .then((wiki) => {
              expect(wiki.title).toBe("Cats");
              expect(wiki.body).toBe("Cats can turn their ears 180 degrees");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
=======
    const options = {
      url: `${base}create`,
      form: {
        title: "Cats",
        body: "Cats can turn their ears 180 degrees",
        userId: 1,
        private: false
      }
    };

    it("should create a new wiki", (done) => {
      request.post(options, (err, res, body) => {
        Wiki.findOne({where: {title: "Cats"}})
        .then((wiki) => {
          expect(wiki.title).toBe("Cats");
          expect(wiki.userId).not.toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
>>>>>>> master
    });

    it("should not create a new wiki that fails validation", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Chinchillas",
          body: "They are soft"
        }
      };

      request.post(options,
        (err, res, body) => {

          Wiki.findOne({ where: { title: "Chinchillas" } })
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
        expect(this.wiki.title).toContain("Basenji");
        expect(this.wiki.body).toContain("They are known as the barkless dog");
        done();
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {

    it("should delete the wiki with the associated ID", (done) => {
      Wiki.findAll()
        .then((wiki) => {
          const wikiCountBeforeDelete = wiki.length;
          expect(wikiCountBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
              .then((wiki) => {
                expect(err).toBeNull();
                expect(wiki.length).toBe(wikiCountBeforeDelete);
                done();
              });
          });
        });
    });
  });

  describe("GET /wikis/:id/edit", () => {

    it("should render a view to edit a wiki", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Basenji");
        done();
      });
    });
  });

  describe("POST /wikis/:id/update", () => {

    it("should update the wiki with the given title and body", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Basenjis",
          body: "They are known as the barkless dog."
        }
      };
      request.post(options,
        (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: { id: this.wiki.id }
          })
            .then((wiki) => {
              expect(wiki.title).toBe("Basenji");
              done();
            });
        });
    });
  });
});
