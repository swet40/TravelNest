const express= require("express");
const app = express();
const mongoose= require("mongoose");
// const Listing = require("./models/listings");
const path = require("path");
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
})

.catch(err => console.log(err));
async function main() {
await mongoose.connect(mongo_url);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));//to use css files

app.get('/',(req,res)=>{
    res.send('Hi I am root');
})


app.use('/listing',listings);
app.use('/',reviews);

app.all("*",(req,res,next) => {
    next(new ExpressError(404, "Page not found!"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500, message= "something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{ message });
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})