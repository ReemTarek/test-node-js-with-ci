const {verifySignUp} = require("../middlewares");

const controller = require("../controllers/auth.controller");


module.exports = function(app)
{
    app.use(function(req,res,next){
        res.header(
            
            
            "Access-Control-Allow-Headers",
            "X-access-token, Origin, Content-Type, Accept"
        );
        next();

    });
    app.post("/singup",
    [  
        verifySignUp.checkRolesExisted
    ],
    controller.signup
    );
    app.post("/signin", controller.signin);
    app.get("/signup", controller.getsignup);
    app.get("/signin", controller.getsignin);
    app.get("/signout", controller.signout);
}
