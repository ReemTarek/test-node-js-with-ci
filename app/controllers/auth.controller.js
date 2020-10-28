const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup=(req,res)=>{
    const user = new User({
        username : req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        passwordConfirm: bcrypt.hashSync(req.body.passwordConfirm, 8),
        phone : req.body.phone,
        accessToken: null

    });
    user.save((err,user)=>{
        if(err)
        {   if(err.code == 11000)
            {
                req.flash('error',"user name or email already taken before");
                res.redirect("/signup")


            }
            else
            {
                req.flash('error', err.message);
                res.redirect("/signup")

            }
  
            return;
        }
        if(req.body.roles)
        {
            Role.find(
                {
                    name: {$in: req.body.roles}
                },
                (err,roles)=>{
                    if(err)
                    {
                        req.flash('error', err.message);
                        res.redirect("/signup")
                        return;
                    }
                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if(err)
                        {
                            req.flash('error', err.message);
                            res.redirect("/signup")
                            return;
                        }
                        req.flash('success', 'user registered successfully');
                        res.redirect('/signin');
                     
                    })

                }
            )
            //next();
        }else
        {
            Role.findOne({name:"user"}, (err, role)=>{
                if(err)
                {
                    req.flash('error', err.message);
                    res.redirect("/signup")
                    return;
                }
                //console.log("roles"+role)
                user.roles = [role._id];
                user.save(err =>{
                    if(err)
                    {
                        req.flash('error', err.message);
                        res.redirect("/signup")
                        return;
                    }
                    req.flash('success', 'user registered successfully');
                        res.redirect('/signin');
                  //  next();
                })
            })
        }
    })
}
exports.signin = (req,res)=>{
    User.findOne({
        username: req.body.username
    }).populate("roles","-__v").exec((err,user)=>{
        if(err)
        {
            req.flash('error', 'wrong credentials');
            res.redirect("/signin")
            return;
        }
        if(!user)
        {
            req.flash('error', 'wrong credentials');
            res.redirect("/signin")
            return;
        }
        var passwordcheck = bcrypt.compareSync(
            req.body.password,
            user.password
        )
        if(!passwordcheck)
        {
            req.flash('error', 'wrong credentials');
            res.redirect("/signin")
            return
        }
        var session = req.session;
        session.userid = user._id;
        var token = jwt.sign({id: user._id}, config.secret,{
            expiresIn:86400
        })
        var authorities = [];
        for(let i=0; i< user.roles.length;i++)
        {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase())
            
        }
        User.findByIdAndUpdate({_id: user._id},{"accessToken": token}, {useFindAndModify: false},function(err, result){

            if(err){
                res.send(err)
            }
            else{
                res.status(200).send({id:user._id, username: user.username, email: user.email, roles:authorities, accessToken:token});
                //next();
            }
    
        })
        
    });

};
exports.signout = (req,res,next)=>{
    var session = req.session;
    User.findByIdAndUpdate({_id: session.userid},{"accessToken": "NULL"}, {useFindAndModify: false},function(err, result){

        if(err)
        {console.log(err)
            res.status(500).send({message:err});
            return;
        }
        else
        {  req.session.destroy((err) => {
            if (err) {
              next(err)
            } else {
                res.status(201).send({message:"logged out success"})
            }
          })
          
        }
     

    })
}
exports.getsignup = (req,res)=>{
    res.render("signup")
}
exports.getsignin =(req,res)=>{
    res.render("login");
}