const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listings");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//index route
router.get('/',wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})
);

//new route
router.get('/new',(req,res)=>{
    res.render('listings/new.ejs')
})

//show route
router.get('/:id', wrapAsync(async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
})
);

//create route
router.post('/', 
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
        res.redirect('/listing');
    })
)

//edit route
router.get('/:id/edit', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
);

//update route
router.put("/:id",wrapAsync(async(req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400, "send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
})
);

//DELETE ROUTE
router.delete("/:id", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect('/listing');
})
);

module.exports = router;