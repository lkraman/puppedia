const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;



describe("Wiki", () => {

  beforeEach((done) => {
     this.wiki;
     this.user;

     sequelize.sync({force: true}).then((res) => {

// #2
       User.create({
         username: "username",
         email: "starman@tesla.com",
         password: "Trekkie4lyfe"
       })
       .then((user) => {
         this.user = user; //store the user

         Wiki.create({
           title: "Expeditions to Alpha Centauri",
           body: "A compilation of reports from recent visits to the star system.",
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
        })
      });
    });

  describe("#create()", () => {

    it("should create a wiki object with a title and body", (done) => {

      Wiki.create({
          title: "Expeditions to Alpha Centauri",
          body: "A compilation of reports from recent visits to the star system.",
          userId: this.user.id
        })
        .then((wiki) => {

          //#2
          expect(wiki.title).toBe("Expeditions to Alpha Centauri");
          expect(wiki.body).toBe("A compilation of reports from recent visits to the star system.");
          done();

        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });
    it("should not create a wiki with missing title, body or assigned user", (done) => {
      Wiki.create({
        title:"Wiki Title Test"
      })
      .then((wiki) => {
        //validation error will skip this
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.body cannot be null");
        expect(err.message).toContain("Wiki.userId cannot be null");
        done();
      });
    });
  });
 });


 describe("#setUser()", () => {

  it("should associate a wiki and a user together", (done) => {

    User.create({
      username: "username",
      email: "starman@tesla.com",
      password: "Trekkie4lyfe"
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
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
        });
    });
  });
