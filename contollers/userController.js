const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const mongoose = require("mongoose");

exports.register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
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
    const users = await User.find(
      {},
      { password: 0, createdAt: 0, updatedAt: 0, isAdmin: 0 }
    );

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return false;
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });

    if (!user) {
      return res.status(404).json({
        staus: "error",
        message: "user not found",
      });
    }

    const { password, updatedAt, ...other } = user._doc;

    return res.status(200).json({
      status: "ok",
      user: other,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "get user failed",
      err,
    });
  }
};

exports.getUserByName = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        staus: "error",
        message: "user not found",
      });
    }

    const { password, updatedAt, ...other } = user._doc;

    return res.status(200).json({
      status: "ok",
      user: other,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "get user failed",
      err,
    });
  }
};

exports.updateCoverPicture = async (req, res) => {
  const user = await User.findOne({
    _id: mongoose.Types.ObjectId(req.params.id),
  });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "user not found",
    });
  }

  const path = `public/${user.coverPicture}`;
  fs.unlink(path, (err) => console.log(err));

  user.coverPicture = `images/${req.file.filename}`;

  await user.save();

  return res.status(200).json({
    status: "ok",
    message: "update cover picture success",
    user,
  });
};

exports.updateUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      let user = await User.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

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

      if (req.file) {
        const path = `public/${user.profilePicture}`;
        fs.unlink(path, (err) => console.log(err));

        user.profilePicture = `images/${req.file.filename}`;
        await user.save();
      }

      await User.updateOne({ _id: user._id }, { $set: req.body });

      return res.status(200).json({
        status: "ok",
        message: "user updated",
        user,
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
      const user = await User.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      const path = `public/${user.profilePicture}`;
      fs.unlink(path, (err) => console.log(err));

      const path2 = `public/${user.coverPicture}`;
      fs.unlink(path2, (err) => console.log(err));

      await User.deleteOne({ _id: mongoose.Types.ObjectId(user._id) });

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

exports.follow = async (req, res) => {
  try {
    if (req.params.id !== req.body.userId) {
      const currentUser = await User.findById(req.body.userId);
      const otherUser = await User.findById(req.params.id);

      const followCheck = otherUser.followers.includes(currentUser._id);

      if (!followCheck) {
        await currentUser.updateOne({ $push: { followings: otherUser._id } });
        await otherUser.updateOne({ $push: { followers: currentUser._id } });
        return res.status(200).json({
          status: "ok",
          message: "follow user success",
        });
      } else {
        return res.status(200).json({
          status: "error",
          message: "you already following this account",
        });
      }
    } else {
      return res.status(500).json({
        status: "error",
        message: "you cannot follow yourself",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "can't follow the user",
    });
  }
};

exports.unFollow = async (req, res) => {
  try {
    if (req.params.id !== req.body.userId) {
      const currentUser = await User.findOne({
        _id: mongoose.Types.ObjectId(req.body.userId),
      });
      const otherUser = await User.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      const followCheck = otherUser.followers.includes(currentUser._id);

      if (followCheck) {
        await currentUser.updateOne({
          $pull: { followings: mongoose.Types.ObjectId(otherUser._id) },
        });
        await otherUser.updateOne({
          $pull: { followers: mongoose.Types.ObjectId(currentUser._id) },
        });
        return res.status(200).json({
          status: "ok",
          message: "unfollow user success",
        });
      } else {
        return res.status(200).json({
          status: "error",
          message: "you don't following this account",
        });
      }
    } else {
      return res.status(500).json({
        status: "error",
        message: "you cannot unfollow yourself",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "can't unfollow the user",
    });
  }
};
