module.exports = {

    fakeIt(app){
  
      let username, email, role, id;
  
      function middleware(req,res,next){
  
        username = req.body.username || username;
        email = req.body.email || email;
        role = req.body.role || role;
        id = req.body.userId || id;
  
        if(id && id != 0){
          req.user = {
            "username": username,
            "email": email,
            "role": role,
            "id": id,
          };
        } else if(id == 0) {
          delete req.user;
        }
  
        if( next ){ next() }
      }
  
      function route(req,res){
        res.redirect("/")
      }
  
      app.use(middleware)
      app.get("/auth/fake", route)
    }
  }