require('dotenv').config()
const mongoose   =  require("mongoose")
mongoose.connect(process.env.dbURL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("connected to Blog DB"))
.catch(error => console.log(error.message));