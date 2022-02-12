const mongoose = require("mongoose");

const hashSchema = new mongoose.Schema({
  hash: { type: String },
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

const Hash = mongoose.model("Hash", hashSchema);
module.exports = Hash;
