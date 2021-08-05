const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: password,
    });

    await user.save();

    return res.status(200).json({
      status: "ok",
      message: "register success",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "register failed",
      err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }
    const password = await bcrypt.compare(req.body.password, user.password);

    if (!password) {
      return res.status(403).json({
        status: "error",
        message: "wrong password",
      });
    }

    res.status(200).json({
      status: "ok",
      message: "login success",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "login failed",
      err,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).json({
        status: "error",
        message: "users not found",
      });
    }
    return res.status(200).json({
      status: "ok",
      users: users,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "failed to get users",
      err,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({
        staus: "error",
        message: "user not found",
      });
    }

    return res.status(200).json({
      status: "ok",
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "get user failed",
      err,
    });
  }
};

exports.updateUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      let user = await User.findOne({ _id: req.params.id });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      await User.updateOne({ _id: user._id }, { $set: req.body });

      return res.status(200).json({
        status: "ok",
        message: "user updated",
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "update user failed",
        err,
      });
    }
  } else {
    return res.status(500).json({
      status: "error",
      message: "update failed, you can only update your account",
    });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }
      await User.deleteOne({ _id: user._id });

      return res.status(200).json({
        status: "ok",
        message: "user deleted",
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "delete user failed",
      });
    }
  } else {
    return res.status(500).json({
      status: "error",
      message: "you can only delete your account",
    });
  }
};