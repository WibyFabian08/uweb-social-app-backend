const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      userId: req.body.userId,
      body: req.body.body,
      image: `images/${req.file.filename}`,
    });

    return res.status(200).json({
      status: "sukses",
      post,
    });
  } catch (err) {
    return res.status(500).json({
      status: "ok",
      message: "post failed",
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "post not found",
      });
    }

    if (req.body.userId !== post.userId) {
      return res.status(403).json({
        status: "error",
        message: "you can only update your post",
      });
    }

    post.body = req.body.body;

    if (req.file) {
      const path = `public/${post.image}`;
      fs.unlink(path, (err) => console.log(err));

      post.image = `images/${req.file.filename}`;
    }

    await post.save();

    return res.status(200).json({
      status: "ok",
      message: "update success",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "update post failed",
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "post not found",
      });
    }

    if (req.body.userId !== post.userId) {
      return res.status(403).json({
        status: "error",
        message: "you only can delete your post",
      });
    }

    const path = `public/${post.image}`;
    fs.unlink(path, (err) => console.log(err));

    await Post.deleteOne({ _id: post._id });

    return res.status(200).json({
      status: "ok",
      message: "delete success",
    });
  } catch (err) {
    return res.status(200).json({
      status: "error",
      message: "delete post failed",
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.body.userId });
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "post not found",
      });
    }

    if (!post.likes.includes(currentUser._id)) {
      await post.updateOne({ $push: { likes: currentUser._id } });
      return res.status(200).json({
        status: "ok",
        message: "like post success",
      });
    } else {
      await post.updateOne({ $pull: { likes: currentUser._id } });
      return res.status(200).json({
        status: "ok",
        message: "unlike post success",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "like post failed",
    });
  }
};

exports.detailPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "post not found",
      });
    }

    const user = await User.findOne({ _id: post.userId });

    return res.status(200).json({
      status: "ok",
      message: "post detail",
      post,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "get a post failed",
    });
  }
};

exports.getUserPost = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    const posts = await Post.find({ userId: user._id });

    return res.status(200).json({
      status: "ok",
      message: "someone posts",
      posts,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "get posts failed",
    });
  }
};

exports.getTimeline = async (req, res) => {
  const currentUser = await User.findOne({ _id: req.params.userId });
  const myPost = await Post.find({ userId: currentUser.userId });
  const friendsPost = await Promise.all(
    currentUser.followings.map((friendId) => {
      return Post.find({ userId: friendId });
    })
  );
  return res.status(200).json({
    status: "ok",
    message: "timeline post",
    timeline: myPost.concat(...friendsPost)
  });
};
