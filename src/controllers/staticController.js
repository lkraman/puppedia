module.exports = {
    index(req, res, next){
        res.render("static/index", {title: "Welcome to Blocipedia"});
    }
  }
  //stopped at static controller in Routing, Controllers and the View