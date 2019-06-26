const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;

describe("Collaborator", () => {
  beforeEach(done => {
    this.wiki;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "lauraloo",
        email: "lauraloo@example.com",
        password: "password"
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

  describe("#create", () => {
    it("should create a collaborator object associated with wikiId and userId", done => {
      Collaborator.create({
        wikiId: this.wiki.id,
        userId: this.user.id
      })
        .then(collaborator => {
          expect(collaborator.wikiId).toBe(1);
          expect(collaborator.userId).toBe(1);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it("should not create a collaborator on a wiki with missing user or post ID", done => {
      Collaborator.create({
        userId: null
      })
        .then(collaborator => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Collaborator.userId cannot be null");
          expect(err.message).toContain("Collaborator.wikiId cannot be null");
          done();
        });
    });
  });
});