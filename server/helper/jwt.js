require("dotenv").config;
const jwt = require("jsonwebtoken");
const secretJWT = process.env.JWT_SECRET;

const generateToken = (payload) => {
  return jwt.sign(payload, secretJWT);
};

const verifyToken = (access_token) => {
  return jwt.verify(access_token, secretJWT);
};

module.exports = {
  verifyToken,
  generateToken,
};
