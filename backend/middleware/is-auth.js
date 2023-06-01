const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new Error("Headers not found");
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (err) {
    throw err;
  }

  if (!decodedToken) {
    throw new Error("Can't authenticate user");
  }

  req.userId = decodedToken.userId;
  next();
};
