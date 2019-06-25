const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;

describe("routes : collaborators", () => {
  beforeEach(done => {
    this.wiki;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "lauraloo",
        email: "lauraloo@example.com",
        password: "password",
        role: 1
      })
        .then(user => {
          this.user = user;

          Wiki.create({
            title: "Basenji",
            body: "They are known as the barkless dog",
            private: false,
            userId: this.user.id
          })
            .then(wiki => {
              this.wiki = wiki;
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("POST /wikis/:id/collaborators/add", () => {
    it("should add a collaborator", done => {
      User.create({
          username: "laurafriend",
          email: "laurafriend@example.com",
          password: "password",
          role: 0
      }).then(collab => {
        this.collab = collab;

        const options = {
          url: `{base}/${this.wiki.id}/collaborators/add`,
          form: {
            email: "laurafriend@example.com"
          }
        }
        request.post(options, (err, res, body) => {
          expect(this.collab.userId).toBe(this.user.id);
          done();
        });
      });
    });

    it("should not add a collaborator with invalid email", done => {
      User.create({
          username: "nolaurafriend",
          email: "nolaurafriend@",
          password: "password",
          role: 0
      }).then(collab => {
        this.collab = collab;

        const options = {
          url: `{base}/${this.wiki.id}/collaborators/add`,
          form: {
            email: "nolaurafriend@"
          }
        };

        request.post(options, (err, res, body) => {
          expect(err.message).toContain("Validation error: must be a valid email");
          done();
        });
      });
    });
  });
});