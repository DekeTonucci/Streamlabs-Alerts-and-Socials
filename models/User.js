const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    streamLabsId: String,
    display_name: String,
    tokens: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model('users', userSchema);
