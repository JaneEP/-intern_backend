const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Auth error" });
    }
    const decoded = jwt.verify(token, config.get("secretKey"));
    console.log(decoded);

    req.user = decoded; // след ф-я уже может обращаться к .user
    console.log(req.user.id);

    next();
  } catch (e) {
    return res.status(401).json({ message: "Auth error" });
  }
};
