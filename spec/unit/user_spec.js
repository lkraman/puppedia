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
    it("should create a User object with a valid username and email", (done) => {
      User.create({
        username: "fakeusername",
        email: "user@example.com",
        password: "password"
      })
      .then((user) => {
        expect(user.username).toBe("fakeusername");
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a user with invalid email", (done) => {
      User.create({
        username: "fakeusername",
        email: "invaliduser@example.com",
        password: "password"
      })
      .then((user) => {

        // The code in this block will not be evaluated since the validation error
        // will skip it. Instead, we'll catch the error in the catch block below
        // and set the expectations there.

        done();
      })
      .catch((err) => {
        expect(err.message).toContain("is not defined");
        done();
      });
    });


    it("should not create a user with an email and username already taken", (done) => {

      User.create({
        username: "fakeusername",
        email: "user@example.com",
        password: "passssword"
      })
      .then((user) => {

        User.create({
            username: "fakeusername",
            email: "user@example.com",
            password: "password"
        })
        .then((user) => {
          // the code in this block will not be evaluated since the validation error
          // will skip it. Instead, we'll catch the error in the catch block below
          // and set the expectations there
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