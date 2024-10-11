const express= require("express");
const app = express();
const mongoose= require("mongoose");
const Listing = require("./models/listings");
const path = require("path");
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./schema.js");
const review = require("./models/review.js");

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
//index route
app.get('/listing',wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})
);

//new route
app.get('/listing/new',(req,res)=>{
    res.render('listings/new.ejs')
})

//show route
app.get('/listing/:id', wrapAsync(async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
);

//create route
app.post('/listing', 
    wrapAsync(async (req,res,next) =>{
        if(!req.body.listing){
            throw new ExpressError(400, "send valid data for listing");
        }
        const newListing=new Listing(req.body.listing);
        if(!newListing.title){
            throw new ExpressError(400, "Title is missing!");
        }
        if(!newListing.description){
            throw new ExpressError(400, "Description is missing!");
        };
        if(!newListing.location){
            throw new ExpressError(400, "Location is missing!");
        }

        await newListing.save();
        res.redirect('/listing')
    })
)

//edit route
app.get('/listing/:id/edit', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
);

//update route
app.put("/listing/:id",wrapAsync(async(req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400, "send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
})
);

//DELETE ROUTE
app.delete("/listing/:id", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect('/listing');
})
);

//Reveiws
//post route
app.post("/listing/:id/reveiws", async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new  review(req.body.review);

    listing.reviews.push(newReview);

    await review.save();
    await listing.save();
    console.log("new review saved");
    res.send("new review saved");
})

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