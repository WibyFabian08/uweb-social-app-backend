const express = require('express');
const app = express();
const helmet = require("helmet");
const port = 3000;

const db = require('./connection');
const authRouter = require('./routes/auth');

// gunakan express.json unutk request body
app.use(express.json())
app.use(helmet());

app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`server ruuning at port ${port}`)
})

module.exports = app;