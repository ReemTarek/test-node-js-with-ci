const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/test/all", controller.allAccess);

  app.get("/test/user/(:token)", [authJwt.verifyToken, authJwt.IsLoggedIn], controller.userBoard);

  app.get(
    "/test/mod/(:token)",
    [authJwt.verifyToken, authJwt.isModerator,authJwt.IsLoggedIn],
    controller.moderatorBoard
  );

  app.get(
    "/test/admin/(:token)",
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.IsLoggedIn],
    controller.adminBoard
  );
};