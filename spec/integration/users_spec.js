const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({
        force: true
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

  });

  describe("POST /users", () => {

    it("should create a new user with valid username, email, password, and redirect", (done) => {

      const options = {
        url: base,
        form: {
          username: "username",
          email: "user@example.com",
          password: "123456789"
        }
      }

      request.post(options,
        (err, res, body) => {

      
          User.findOne({
              where: { 
                username: "username",
                email: "user@example.com",
                password: "123456789"
              }
            })
            .then((user) => {
              expect(user.username).toBe("username");
              expect(user.email).toBe("user@example.com");
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
      request.post({
          url: base,
          form: {
            username: "blah",
            email: "no",
            password: "123456789"
          }
        },
        (err, res, body) => {
          User.findOne({
              where: {
                username: "blah",
                email: "no"
              }
            })
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

});