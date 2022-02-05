if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose   =  require("mongoose")
mongoose.connect(process.env.dbURL,
{
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to Blog DB"))
.catch(error => console.log(error.message));