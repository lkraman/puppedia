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
    it("should create a User object with a valid email and password", (done) => {
      User.create({
        username: "lauraloo",
        email: "user@example.com",
        password: "password"
      })
      .then((user) => {
        expect(user.username).toBe("lauraloo");
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a user with an invalid email", (done) => {
      User.create({
        username: "lauraloo",
        email: "invalid email",
        password: "password"
      })
      .then((user) => {
        //should not execute
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a user with credentials that are already in use", (done) => {
      User.create({
        username: "lauraloo",
        email: "user@example.com",
        password: "password"
      })
      .then((user) => {
        User.create({
          username: "lauraloo",
          email: "user@example.com",
          password: "passssword"
        })
        .then((user) => {
          //should not execute
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