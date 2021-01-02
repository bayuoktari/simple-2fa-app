const bcrypt = require("bcrypt");
const salt = 8;

const encryptPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (plainPassword, encryptedPassword) => {
  return bcrypt.compareSync(plainPassword, encryptedPassword);
};

module.exports = {
  encryptPassword,
  comparePassword,
};
