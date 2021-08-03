const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/uweb-social-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('koneksi berhasil')
});

module.exports = db;