const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force:true}).then((res) => {
      User.create({
        username: "lauraloo",
        email: "lauraloo@example.com",
        password: "password"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Basenji",
          body: "They are known as the barkless dog",
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

  it("should create a wiki object with a title, body, and associated user", (done) => {
    Wiki.create({
      title: "Basenji",
      body: "They are known as the barkless dog",
      userId: this.user.id
    })
    .then((wiki) => {
      expect(wiki.title).toBe("Basenji");
      expect(wiki.body).toBe("They are known as the barkless dog");
     
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  it("should not create a with a missing title, body, or associated user", (done) =>{
    Wiki.create({
      title:""
    })
    .then((wiki) => {

// the code in this block will not be evaluated since the validation error
       // will skip it. Instead, we'll catch the error in the catch block below
       // and set the expectations there

      done();
    })
    .catch((err) => {
        expect(err.message).toContain("Wiki.body cannot be null");
        expect(err.message).toContain("Wiki.userId cannot be null");
        done();
      done();
    });
  });

});
describe("#setUser()", () => {

  it("should associate a wiki and a user together", (done) => {

    User.create({
      username: "lauraloo",
      email: "lauraloo@example.com",
      password: "password"
    })
    .then((newUser) => {

      expect(this.wiki.userId).toBe(this.user.id);
      this.wiki.setUser(newUser)
      .then((wiki) => {
        expect(this.wiki.userId).toBe(newUser.id);
        done();

      });
    })
  });
});

describe("#getUser()", () => {
  it("should return the associated user", (done) => {

    this.wiki.getUser()
    .then((associatedUser) => {
      expect(associatedUser.email).toBe("lauraloo@example.com");
      done();
    });
  });
});
});

