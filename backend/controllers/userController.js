const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res, next) => {
  const { email, password, name } = req.body;
  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) throw new Error("user already exist");
      return bcrypt.hash(password, 12).then((hash) => {
        const newUser = new UserModel({
          name: name,
          email: email,
          password: hash,
        });
        return newUser.save();
      });
    })
    .then(() => {
      res.status(200).json({ message: "user created successfully" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let token = null;
  UserModel.findOne({ email: email })
    .then((user) => {
      return bcrypt.compare(password, user.password).then((matched) => {
        if (matched) {
          token = jwt.sign({ email: user.email, userId: user._id }, "secret", {
            expiresIn: "1h",
          });
          return user;
        } else {
          throw new Error("Email or password does not match");
        }
      });
    })
    .then((user) => {
      res
        .status(200)
        .json({ token: token, userId: user._id, status: user.status });
    })
    .catch((err) => {
      next(err);
    });
};
