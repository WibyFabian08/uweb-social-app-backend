const express = require('express');
const app = express();
const helmet = require("helmet");
const path = require("path");
const port = 3000;

const db = require('./connection');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

app.use("/images", express.static(path.join(__dirname, "public/images")));

// gunakan express.json unutk request body
app.use(express.json())
app.use(helmet());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(port, () => {
    console.log(`server ruuning at port ${port}`)
})

module.exports = app;