const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

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
        expect(body).toContain("Welcome to Blocipedia")
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
          email: "user@example.com",
          password: "password"
        }
      }
      request.post(options, (err, res, body) => {
        User.findOne({where: {email: "user@example.com"}})
        .then((user) => {
          expect(user).noy.toBeNull();
          expect(user.username).toBe("lauraloo")
          expect(user.email).toBe("user@example.com");
          expect(user.id).toBe(1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

    it("should not create a user with invalid values and redirect", (done) => {
      request.post(
        {
          url: base,
          form: {
            username: "blah",
            email: "invalid",
            password: "password"
          }
        },
        (err, res, body) => {
          User.findOne({where: {email: "invalid"}})
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
        expect(body).toContain("Sign In");
        done();
      });
    });
  });
});
