const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Message = new Schema(
  {
    conversationId: {
      type: ObjectId,
      ref: "Conversation",
    },
    sender: {
      type: ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", Message);
