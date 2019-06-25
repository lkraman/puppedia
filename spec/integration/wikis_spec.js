const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

  beforeEach((done) => {
    sequelize.sync({ force: true }).then((res) => {
      User.create({
        username: "lauraloo",
        email: "lauraloo@example.com",
        password: "password",
        role: 0
      })
        .then((user) => {
          this.user = user;

          Wiki.create({
            title: "Basenjis",
            body: "They are known as the barkless dog",
            private: false,
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

  describe("GET /wikis", () => {
    it("should render a list of public wikis", (done) => {
      request.get(`${base}/wiki`, (err, res, body) => {
        expect(body).not.toContain("wiki");
        done();
      });
    });
  });

  //standard memebr context suite testing
  describe("standard users", () => {
    beforeEach((done) => {
      User.create({
        username: "standardmember",
        email: "standardmember@example.com",
        password: "password",
        role: 0
      })
        .then((user) => {
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              userId: user.id,
              username: user.username,
              email: user.email
            }
          },
            (err, res, body) => {
              done();
            });
        });
    })

    describe("GET /wikis/new", () => {
      it("should render a new wiki form", (done) => {
        request.get(`${base}/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("New Wiki");
          done();
        });
      });
    });
  });

  describe("POST /wikis/create", () => {
    it("should create a new wiki and redirect", (done) => {
      const options = {
        url: `${base}/create`,
        form: {
          title: "Basenji",
          body: "They are known as the barkless dog",
          private: false,
          userId: this.user.id
        }
      };

      request.post(options,
        (err, res, body) => {

          Wiki.findOne({ where: { title: "Basenji" } })
            .then((wiki) => {
              expect(wiki).toBeNull();
              expect(wiki.title).toBe("Basenji");
              expect(wiki.body).toBe("They are known as the barkless dog");
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

  describe("GET wikis/:id", () => {
    it("should render a view with the selected wiki", (done) => {
      request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("barkless dog");
        done();
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {
    it("should delete the wiki with the associated id", (done) => {
      Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);
  
          request.post(`${base}/${this.wiki.id}/destroy`, (err,res, body) => {
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).not.toBe(wikiCountBeforeDelete - 1);
              done();
              })
          });
        });
    });
  });

  describe("GET /wikis/:id/edit", () => {
    it("should render a view with an edit wiki form", (done) => {
      request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).not.toContain("Edit Wiki");
        done();
      });
    });
  });

  describe("POST /wikis/:id/update", () => {
    it("should update the post with the given values", (done) => {
      const options = {
        url: `${base}/${this.wiki.id}/update`,
        form: {
          title: "Basenjis",
          body: "They are known as the barkless dog",
        }
      };
      request.post(options,
        (err, res, body) => {

          expect(err).toBeNull();
          Wiki.findOne({
            where: { id: this.wiki.id }
          })
            .then((wiki) => {
              expect(wiki.title).toBe("Basenjis");
              done();
            });
        });
    });
  }); 
  //end standard member


  //premium member suite testing
  describe("premium users", () => {
    beforeEach((done) => {
      User.create({
        username: "premiummember",
        email: "premiummember@example.com",
        password: "password",
        role: 1
      })
        .then((user) => {
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              userId: user.id,
              username: user.username,
              email: user.email
            }
          },
            (err, res, body) => {
              done();
            });
        });
    });

    describe("GET /wikis/new", () => {
      it("should render a new wiki form", (done) => {
        request.get(`${base}/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("New Wiki");
          done();
        });
      });
    });

    describe("POST /wikis/create", () => {
      it("should create a new public wiki and redirect", (done) => {
        const options = {
          url: `${base}/create`,
          form: {
            title: "Basenjis",
            body: "They are known as the barkless dog",
            private: false,
            userId: this.user.id
          }
        };

        request.post(options,
          (err, res, body) => {

            Wiki.findOne({ where: { title: "Basenji" } })
              .then((wiki) => {
                expect(wiki).toBeNull();
                expect(wiki.title).toBe("Basenji");
                expect(wiki.body).toBe("They are known as the barkless dog");
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

    describe("GET wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("barkless dog");
          done();
        });
      });
    });

    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki with the associated id", (done) => {
        Wiki.findAll()
          .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;
            expect(wikiCountBeforeDelete).toBe(1);
    
            request.post(`${base}/${this.wiki.id}/destroy`, (err,res, body) => {
              Wiki.findAll()
              .then((wikis) => {
                expect(err).toBeNull();
                expect(wikis.length).not.toBe(wikiCountBeforeDelete - 1);
                done();
                })
            });
          });
      });
    });

    describe("GET /wikis/:id/edit", () => {
      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit");
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update the post with the given values", (done) => {
        const options = {
          url: `${base}/${this.wiki.id}/update`,
          form: {
            title: "Basenjis",
            body: "They are known as the barkless dog",
          }
        };
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();
            Wiki.findOne({
              where: { id: this.wiki.id }
            })
              .then((wiki) => {
                expect(wiki.title).toBe("Basenjis");
                done();
              });
          });
      });
    });

    describe("POST /wikis/create", () => {
      it("should create a new private wiki and redirect", (done) => {
        const options = {
          url: `${base}/create`,
          form: {
            title: "Basenji",
            body: "They are known as the barkless dog",
            private: true,
            userId: this.user.id
          }
        };

        request.post(options,
          (err, res, body) => {

            Wiki.findOne({ where: { title: "Basenji" } })
              .then((wiki) => {
                expect(wiki).toBeNull();
                expect(wiki.title).toBe("Basenji");
                expect(wiki.body).toBe("They are known as the barkless dog");
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




  }); //end premium member context

}); 