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
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    
      describe("#create()", () => {
        it("should create a wiki object with title, body and assigned user", (done) => {
          Wiki.create({
            _title: "Cats",
            get title() {
              return this._title;
            },
            set title(value) {
              this._title = value;
            },
            body: "Cats can rotate their ears 180 degrees.",
            userId: this.user.id
          })
          .then((wiki) => {
            expect(wiki.title).toBe("Cats");
            expect(wiki.body).toBe("Cats can rotate their ears 180 degrees.");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
    
        it("should not create a wiki object with missing title or body", (done) => {
          Wiki.create({
            title: "Cats"
          })
          .then((wiki) => {
            done();
          })
          .catch((err) => {
            expect(err.message).toContain("Wiki.body cannot be null");
            done();
          });
        });
      });
    
      describe("#setUser()", () => {
        it("should associate a wiki and a user together", (done) => {
          User.create({
            username: "fakeusername",
            email: "fakeuser@example.com",
            password: "123456"
          })
          .then((newUser) => {
            expect(this.wiki.userId).toBe(this.user.id);
            this.wiki.setUser(newUser)
            .then((wiki) => {
              expect(this.wiki.userId).toBe(newUser.id);
              done();
            });
          });
        });
      });
    
      describe("#getUser()", () => {
        it("should return the associated user", (done) => {
          this.wiki.getUser()
          .then((associatedUser) => {
            expect(associatedUser.email).toBe("user@example.com");
            done();
          });
        });
      });
    });