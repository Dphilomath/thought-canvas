const mongoose = require('mongoose');
const { Schema } = mongoose;
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date, default: Date.now
    },
    author: {type: Schema.Types.ObjectId, ref: 'User'}
})

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;