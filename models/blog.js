const mongoose = require('mongoose')
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date, default: Date.now
    } 
})

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;