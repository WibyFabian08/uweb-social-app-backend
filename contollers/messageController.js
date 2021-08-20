const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

exports.createMessage = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.body.conversationId,
    });

    if (!conversation) {
      return res.status(404).json({
        status: "error",
        message: "conversation not found",
      });
    }

    const message = new Message({
      conversationId: conversation._id,
      senderId: req.body.senderId,
      text: req.body.text,
    });

    await message.save();

    return res.status(200).json({
      status: "ok",
      message,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "cannot create message",
    });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
    });

    if (!conversation) {
      return res.status(404).json({
        status: "error",
        message: "conversation not found",
      });
    }

    const messages = await Message.find({ conversationId: conversation._id });

    return res.status(200).json({
      status: "ok",
      message: "get message success",
      messages,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "get message failed",
    });
  }
};
