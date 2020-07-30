var bodyParser   =  require("body-parser")
var methodOverride = require("method-override"),
express      =  require("express"),
app = express(); 
const mongoose   =  require("mongoose");
mongoose.connect("mongodb+srv://Daniyal_12:sa4GQM@data.fee59.mongodb.net/restful_Blog?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("connected to Blog DB"))
.catch(error => console.log(error.message));


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.set("view engine", "ejs");



var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date, default: Date.now
    } 
})

var Blog = mongoose.model("Blog", blogSchema);


app.get("/", function(req, res){
    res.redirect("/blogs");
})


app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs:blogs})
        }
    })
})

app.get("/blogs/new", function(req, res){
    res.render("new");
})

app.post("/blogs", function(req, res){
    
    Blog.create(req.body, function(err, createdBlog){
        if(err){
            console.log(err);
        }
        else{
         res.redirect("/"); 
        }
    })
})

app.get("/blogs/:id", function(req, res){
    var id=req.params.id;
    
    Blog.findById(id, function(err, foundBlog){
        if(err){
            res.render("/");
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    })
})


app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err)
        }
        else{
            res.render("edit", {blog:foundBlog})
        }
    })
})

//UPDATE
app.put("/blogs/:id", function(req, res){
    var id = req.params.id;
    Blog.findByIdAndUpdate(id, req.body, function(err, updatedBlog){
        if(err){
            console.log(err);
        }
        else {
            res.redirect("/blogs/" + id)
        }
    })
})

//DELETE

app.delete("/blog/:id", function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("could not be deleted");
        }
        else{
            res.redirect("/")
        }
    })
})






















app.listen(process.env.PORT, function(){
    console.log("Blog app is running");
})

