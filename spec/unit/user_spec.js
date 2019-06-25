const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  describe("#create()", () => {
    it("should create a User object with a valid username, email, and password", (done) => {
      User.create({
          username: "lauraloo",
          email: "lauraloo@example.com",
          password: "password"
      })
        .then((user) => {
          expect(user.username).toBe("lauraloo");
          expect(user.email).toBe("lauraloo@example.com");
          expect(user.id).toBe(1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });

    it("should not create a user with invalid username, email, or password", (done) => {
      User.create({
        username: "l",
        email: "test@test",
        password: "1"
      })
        .then((user) => {
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error: must be a valid email");
          done();
        });
    });

    it("should not create a user with an email already taken", (done) => {
      User.create({
          username: "lauraloo",
          email: "lauraloo@example.com",
          password: "password"
      })
        .then((user) => {

          User.create({
            username: "lauralooo",
            email: "lauraloo@example.com",
            password: "password"
          })
            .then((user) => {
              done();
            })
            .catch((err) => {
              expect(err.message).toContain("Validation error");
              done();
            });

          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });

  });

});