if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose   =  require("mongoose")
mongoose.connect(process.env.dbURL,
{
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("connected to Blog DB"))
.catch(error => console.log(error.message));