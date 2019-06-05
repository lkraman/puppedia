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

    sequelize.sync({force:true}).then((res) => {
      User.create({
        username: "lauraloo",
        email: "lauraloo@example.com",
        password: "password"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Basenjis",
          body: "They are known as the barkless dog",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
          })
        })
    });
  });

  describe("GET /wikis", () => {

    it("should return a status code of 200 and all wikis", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("wikis");
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {

    it("should render a new wiki form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki")
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {
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
          expect(wiki.body).toBe("Cats can turn their ears 180 degrees");
          expect(wiki.userId).not.toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  })

  describe("GET /wikis/:id", () => {

    it("should render a view of the wiki that the user selects", (done) => {

      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        console.log(this.wiki.title);
        expect(this.wiki.title).toContain("Basenjis");
        done();
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {

    it ("should delete a wiki with the associated id", (done) =>{
      Wiki.findAll()
      .then((wikis) => {

        const wikiCountBeforeDelete = wikis.length;
        expect(wikiCountBeforeDelete).toBe(1);

        request.post(`${base}${this.wiki.id}/destroy`, (err,res, body) => {
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

    it("should render the edit view with a form to edit the wiki", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
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
          title: "Basenji",
          body: "They are known as the barkless dog",
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        Wiki.findOne({
          where: {id: this.wiki.id}
        })
        .then((wiki) => {
          expect(wiki.title).toBe("Basenji");
          done();
        });
      });
    });
  });
});