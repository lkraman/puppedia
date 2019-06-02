const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/"
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {

      User.create({
          username: "lauraloo",
          email: "user@example.com",
          password: "password"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
            title: "Basenji",
            body: "A Basenji is known as a barkless dog",
            userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /wikis", () => {
    it("should render a view with the selected wiki", (done) => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Basenji");
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {
    it("should render a new wiki form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Chinchillas",
        body: "they like dust baths"
      }
    };


    it("should create a new wiki with a title and body", (done) => {
      request.post(options, (err, res, body) => {
        Wiki.findOne({where: {title: "Chinchillas"}})
        .then((wiki) => {
          expect(wiki.title).toBe("Chinchillas");
          expect(wiki.body).toBe("they like dust baths");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
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

  describe("GET /wikis/:id/edit", () => {
    it("should render a view with an edit wiki form", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
        expect(body).toContain("Basenji");
        done();
      });
    });
  });

  describe("POST /wikis/:id/update", () => {
    it("should update the wiki with the given values", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Cats",
          body: "Cats cannot detect sweetness."
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Wiki.findOne({
          where: { id: this.wiki.id }
        })
        .then((wiki) => {
          expect(wiki.title).toBe("Cats");
          done();
        });
      });
    });
  });
});
