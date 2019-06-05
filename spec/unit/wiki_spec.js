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
          title: "Basenjis",
          body: "They are known as the barkless dog",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        });
      });
    });
  });


describe("#create()", () => {

  it("should create a wiki object with a title, body, & privacy setting", (done) => {
    Wiki.create({
      title: "Basenjis",
      body: "They are known as the barkless dog",
      userId: this.user.id
    })
    .then((wiki) => {
      expect(wiki.title).toBe("Basenjis");
      expect(wiki.body).toBe("They are known as the barkless dog");
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  it("should not create a wiki object that doesn't have a title or description", (done) =>{
    Wiki.create({

    })
    .then((wiki) => {
      done();
    })
    .catch((err) => {
      expect(err.message).toContain("Wiki.title cannot be null");
      expect(err.message).toContain("Wiki.body cannot be null");
      done();
    });
  });

});

})