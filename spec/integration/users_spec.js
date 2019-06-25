const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({ force: true })
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

  });

  describe("POST /users", () => {
    it("should create a new user with valid values and redirect", (done) => {

      const options = {
        url: base,
        form: {
          username: "lauraloo",
          email: "lauraloo@example.com",
          password: "password"
        }
      }

      request.post(options,
        (err, res, body) => {

          User.findOne({ where: { email: "lauraloo@example.com" } })
            .then((user) => {
              expect(user).not.toBeNull();
              expect(user.username).toBe("lauraloo");
              expect(user.id).toBe(1);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
    });

    it("should not create a new user with invalid attributes and redirect", (done) => {
      request.post(
        {
          url: base,
          form: {
            username: "l",
            email: "test@test",
            password: "1"
          }
        },
        (err, res, body) => {
          User.findOne({ where: { email: "test@test" } })
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
  });

  describe("GET /users/sign_in", () => {

    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });

  });

  describe("GET /users/premium", () => {
    it("should render a view with a premium upgrade form", (done) => {
      request.get(`${base}premium`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Premium");
        done();
      });
    });
  });

});