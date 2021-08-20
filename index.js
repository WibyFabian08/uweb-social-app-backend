const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");
const port = 3000;

const db = require("./connection");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

// gunakan express.json unutk request body
app.use(express.json());
app.use(helmet());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/conversations", conversationRouter);
app.use("/messages", messageRouter);

app.listen(port, () => {
  console.log(`server ruuning at port ${port}`);
});

module.exports = app;
