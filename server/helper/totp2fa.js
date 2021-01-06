const speakeasy = require("speakeasy");

const generateSecret = () => {
  const secret = speakeasy.generateSecret({
    name: "Project 2fa",
  });
  return {
    base32: secret.base32,
    otpauth_url: secret.otpauth_url,
  };
};

const verifySecret = (secret, token) => {
  console.log(secret, token);
  return speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
  });
};

module.exports = {
  generateSecret,
  verifySecret,
};
