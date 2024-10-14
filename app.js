const express= require("express");
const app = express();
const mongoose= require("mongoose");
const Listing = require("./models/listings");
const path = require("path");
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");

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



const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

app.use('/listings',listings);

//Reveiws
//post review route
app.post("/listing/:id/reviews", validateReview ,wrapAsync (async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new  Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    res.redirect(`/listing/${listing._id}`);
}))

//Delete review route
app.delete("/listing/:id/reviews/:reviewID",
    wrapAsync(async(req,res)=>{
        let {id, reviewID} = req.params;

        await Review.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
        await Review.findByIdAndDelete(reviewID);

        res.redirect(`/listing/${id}`)
    })
)

// app.get('/testlisting', async (req,res) =>{
//     let sampleListing= new Listing ({
//         title: 'My recent Villa',
//         description: "I have invested a lot in it",
//         price: 1200,
//         location: 'Bengaluru, Karnataka',
//         country: 'India'
//     });
//     await sampleListing.save();
//     console.log('sample was saved');
//     res.send("successful sending");
// })
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