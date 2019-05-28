const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

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

  describe("GET /users/sign_up", () => {
    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });//end before each

  describe("POST /users/sign_up", () => {

    it("should create a new user with unique username, valid email, and password", (done) => {

      const options = {
        url: base + "sign_up",
        form: {
          username: "fakeusername",
          email: "example@example.com",
          password: "123456"
        }
      }
      request.post(options,
        (err, res, body) => {
          User.findOne({where: {email: "example@example.com"}})
          .then((user) => {
            expect(user).not.toBeNull();
            expect(user.username).toBe("fakeusername");
            expect(user.email).toBe("example@example.com");
            expect(user.id).toBe(1);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    }); //end valid inputs

    
    it("should not create a new user with a username that is already taken", (done) => {
      request.post(
        {
          url: base + "sign_up",
          form: {
            username: "invalidfakeusername",
            email: "invalid",
            password: "123456"
          }
        },
        (err, res, body) => {
          User.findOne({where: {email: "invalidfakeusername"}})
          .then((user) => {
            expect(user).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });

    it("should not create a new user with invalid email and redirect", (done) => {
      request.post(
        {
          url: base + "sign_up",
          form: {
            username: "invalidfakeusername",
            email: "invalid",
            password: "123456"
          }
        },
        (err, res, body) => {
          User.findOne({where: {email: "invalidexample@example.com"}})
          .then((user) => {
            expect(user).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });

    it("should not create a new user with duplicate email and redirect", (done) => {
      request.post(
        {
          url: base + "sign_up",
          form: {
            username: "invalidfakeusername",
            email: "invalid",
            password: "123456"
          }
        },
        (err, res, body) => {
          User.findOne({where: {email: "invalidexample@example.com"}})
          .then((user) => {
            expect(user).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });

  });//end of invalid inputs

 