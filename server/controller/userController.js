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
          // console.log(matchPassword, req.body.password);
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
  static generate2FA(req, res, next) {
    const secret = generateSecret();
    res.status(201).json(secret);
  }
  static disable2fa(req, res, next) {
    User.update(
      {
        enable2fa: 0,
        secret2fa: null,
      },
      { where: { id: req.loginData.id } }
    )
      .then(() => {
        res.status(200).json({ message: `2FA Successfully Disabled` });
      })
      .catch((err) => {
        next(err);
      });
  }
  static enable2fa(req, res, next) {
    const tokenMatch = verifySecret(req.body.secret, req.body.token);
    // console.log(tokenMatch);
    if (tokenMatch) {
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
            return User.update(
              {
                enable2fa: 1,
                secret2fa: req.body.secret,
              },
              { where: { id: req.loginData.id } }
            );
          }
        })
        .then(() => {
          res.status(200).json({ message: `2FA Successfully Enabled` });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      next({
        errors: [
          {
            status: 400,
            name: "Invalid OTP Token",
            message: "Invalid OTP TOKEN",
          },
        ],
      });
    }
  }
  static verify2fa(req, res, next) {
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
        }
        const tokenMatch = verifySecret(user.secret2fa, req.body.token);
        if (!tokenMatch) {
          throw {
            errors: [
              {
                status: 400,
                name: "Bad Request",
                message: "Invalid Token",
              },
            ],
          };
        } else {
          res.status(200).json({ message: "Token Valid" });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
  static getUserDetail(req, res, next) {
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
          res.status(200).json(user);
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = UserController;
