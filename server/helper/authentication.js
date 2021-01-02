const { verifyToken } = require("./jwt");

module.exports = (req, res, next) => {
  const errMsg = {
    msg: "Invalid Token",
  };
  if (req.headers.access_token) {
    try {
      const payload = verifyToken(req.headers.access_token);
      req.loginData = payload;
      next();
    } catch (err) {
      next(errMsg);
    }
  } else {
    next({
      msg: "Authentication Required",
    });
  }
};
