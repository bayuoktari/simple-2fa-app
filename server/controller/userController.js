const { User } = require("../models");
const { generateToken } = require("../helper/jwt");
const { comparePassword } = require("../helper/bcrypt");
const { generateSecret, verifySecret } = require("../helper/totp2fa");

class UserController {
  static register(req, res, next) {
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          return User.create({
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
            enable2fa: 0,
          });
        } else {
          throw {
            errors: [
              {
                status: 400,
                name: "Bad Request",
                message: "Email already Registered",
              },
            ],
          };
        }
      })
      .then((registeredUser) => {
        const token = generateToken({
          id: registeredUser.id,
          email: registeredUser.email,
        });
        res
          .status(201)
          .json({ access_token: token, "2fa": registeredUser.enable2fa });
      })
      .catch((err) => {
        next(err);
      });
  }
  static login(req, res, next) {
    const errorMsg = {
      errors: [
        {
          status: 400,
          name: "Bad Request",
          message: "Wrong Username or Password",
        },
      ],
    };
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          throw errorMsg;
        } else {
          const matchPassword = comparePassword(
            req.body.password,
            user.password
          );
          if (matchPassword) {
            const token = generateToken({
              id: user.id,
              email: user.email,
            });
            res
              .status(200)
              .json({ access_token: token, "2fa": user.enable2fa });
          } else {
            throw errorMsg;
          }
        }
      })
      .catch((err) => {
        next(err);
      });
  }
  static config2FA(req, res, next) {
    let status;
    User.findOne({ where: { id: req.loginData.id } })
      .then((user) => {
        if (!user) {
          throw {
            errors: [
              {
                status: 404,
                name: "Not Found",
                message: "User Not Found",
              },
            ],
          };
        } else {
          if (!user.enable2fa) {
            status = "Enabled";
            const secret = generateSecret();
            return User.update(
              {
                enable2fa: 1,
                secret2fa: secret,
              },
              { where: { id: req.loginData.id } }
            );
          } else {
            status = "Disabled";
            return User.update(
              {
                enable2fa: 0,
                secret2fa: null,
              },
              { where: { id: req.loginData.id } }
            );
          }
        }
      })
      .then(() => {
        res.status(200).json({ message: `2FA Successfully ${status}` });
      })
      .catch((err) => {
        next(err);
      });
  }
  static verify2fa(req, res, next) {
    User.findOne({ where: { id: req.loginData.id } }).then((user) => {
      if (!user) {
        throw {
          errors: [
            {
              status: 404,
              name: "Not Found",
              message: "User Not Found",
            },
          ],
        };
      }
      const tokenMatch = verifySecret(user.secret2fa.base32, req.body.token);
      if (!tokenMatch) {
        throw { msg: "Invalid Token" };
      } else {
        res.status(200).json({ message: "Token Valid" });
      }
    });
  }
}

module.exports = UserController;
