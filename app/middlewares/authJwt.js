const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
verifyToken = (req,res,next)=>{
    let token = req.params.token;
    if(!token){
        res.render("home",{"title":"no token provided"});
        return;
    }
    jwt.verify(token, config.secret, (err,decoded)=>{
        if(err)
        {
          res.render("home",{"title":"unauthorized"});
          return;
        }
        req.userId = decoded.id;
        next();
    })
};
isAdmin = (req,res,next)=>{
    User.findById(req.userId).exec((err, user) => {
        if (err) {
          req.flash('error', err.message)
          res.render("home",{"title":"unauthorized"});
          return;
        }
    
        Role.find(
          {
            _id: { $in: user.roles }
          },
          (err, roles) => {
            if (err) {
              req.flash('error', err.message)
              res.render("home",{"title":"unauthorized"});
              return;
            }
    
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "admin") {
                next();
                return;
              }
            }
            req.flash('error', "Require Admin Role!")
            res.render("home",{"title":"unauthorized"});
            return;
        
          }
        );
      });
};
isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      Role.find(
        {
          _id: { $in: user.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
  
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
              next();
              return;
            }
          }
  
          req.flash('error', "Require moderator Role!")
          res.render("home",{"title":"unauthorized"});
          return;
        }
      );
    });
  };
  IsLoggedIn = (req,res, next)=>{
    var session = req.session;
    if(session.userid)
    {
   User.findById(req.userId, (err,recordset)=>{
     if(err)
     {
       req.flash('error', err.message);
       res.redirect('/signin');

     }
     if(!recordset.accessToken || recordset.accessToken =="NULL")
     {
       req.flash('error', 'not signed in');
       res.redirect('/signin')
     }
   //  next();
     return;
    
   })
  }else
  {
    req.flash('error', 'not signed in');
       res.redirect('/signin')
      // next();
       return;
  }
  next();
  return;
  }
  const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    IsLoggedIn
  };
  module.exports = authJwt;