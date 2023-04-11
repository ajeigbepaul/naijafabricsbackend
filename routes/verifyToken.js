const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) res.status(403).json("Token is not valid");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authorized");
  }
};

const verifyAuthorizationuser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user?.isadmin) {
      next();
    } else {
      res.status(403).json("You are not authorized for this operation");
    }
  });
};

const verifyAuthorizationadmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user?.isadmin) {
        next();
      } else {
        res.status(403).json("You are not authorized for this operation only admins");
      }
    });
  };
  
module.exports = { verifyToken, verifyAuthorizationuser, verifyAuthorizationadmin };
