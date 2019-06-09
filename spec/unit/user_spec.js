const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

  beforeEach((done) => {
// #1
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

    it("should create a User object with a valid name, email and password", (done) => {

      User.create({
        username: "username",
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {
        expect(user.username).toBe("username")
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done()
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a user with invalid username", (done) => {
      User.create({
        username: "LauraK",
        email: "member@example.com",
        password: "1234567890"
      })
      .then((user) => {
        //validation error will skip this
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: Must be at least 5 characters");
        done();
      });
    });

    it("should not create a user with invalid email", (done) => {
      User.create({
        username: "LauraK",
        email: "mmmmmmm@example.com",
        password: "1234567890"
      })
      .then((user) => {
        //validation error will skip this
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: Must be a valid email");
        done();
      });
    });

    it("should not create a user with an invalid password", (done) => {
      User.create({
        username: "LauraK",
        email: "member@example.com",
        password: "111111111"
      })
      .then((user) => {
        //validation error will skip this
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: Must be at least 6 characters in length");
        done();
      });
    })

    it("should not create a user with an email already taken", (done) => {

      User.create({
        username: "LauraKram",
        email: "member@example.com",
        password: "1234567890"
      })
      .then((user) => {
        User.create({
          username: "LauraKram",
          email: "member@example.com",
          password: "1234567890"
        })
        .then((user) => {
          //validation error will skip this
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("An account with that email already exists");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
});