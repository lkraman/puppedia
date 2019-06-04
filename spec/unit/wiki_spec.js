const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({
      force: true
    }).then((res) => {

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
            });
          });
        });
      });
    
      describe("#create()", () => {
        it("should create a wiki object with a title, body", (done) => {
          Wiki.create({
            title: "Cats",
            body: "Cats can turn their ears 180 degrees",
            UserId: this.user.id
          })
          .then((wiki) => {
            expect(wiki.title).toBe("Cats");
            expect(wiki.body).toBe("Cats can turn their ears 180 degrees");
            expect(wiki.UserId).toBe(this.user.id);
            done();
    
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    
      describe("#destroy()", () => {
        it("should delete the specified wiki", (done) => {
          Wiki.destroy({where: {id: this.wiki.id}})
          .then((wiki) => {
            expect(wiki.title).toBe(undefined);
            done();
    
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    
    });