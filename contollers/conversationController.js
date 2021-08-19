const Conversation = require("../models/Conversation");

exports.createConversation = async (req, res) => {
  try {
    const check = await Conversation.find({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    if (check) {
      return res.status(500).json({
        status: "error",
        message: "conversation already created",
      });
    }

    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    await newConversation.save();

    return res.status(200).json({
      status: "ok",
      newConversation,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "create conversation failed",
    });
  }
};

exports.getConversationWithOneId = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $in: [req.params.userId] },
    });

    if (!conversation) {
      return res.status(404).json({
        status: "error",
        message: "conversation not found",
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "success",
      conversation,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "get old conversation failed",
    });
  }
};

exports.getConversationWithTwoId = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $all: [req.params.senderId, req.params.receiverId] },
    });

    if (conversation.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "conversation not found",
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "success",
      conversation,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "get conversation failed",
    });
  }
};
