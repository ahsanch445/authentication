const jwt = require("jsonwebtoken");

const Protected = (req, res, next) => {
  const headers = req.headers["authorization"];

  if (headers) {
    const token = headers;

    if (token) {
      jwt.verify(token, "AHsa@123", function (err, decoded) {
        if (decoded) {
          req.id = decoded.userId;
        } else if (err) {
          console.log("eror while matching token", err);
        }
      });
    }
  }

  next();
};
module.exports = Protected;
