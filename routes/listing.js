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
    if(!listing){
        req.flash("error","listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listing});
})
);

//create route
router.post('/', 
    wrapAsync(async (req,res,next) =>{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","new listing created");
        res.redirect('/listing');
    })
)

//edit route
router.get('/:id/edit', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you are searching for does not exist!");
        return res.redirect("/listing");
    }
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
    req.flash("success","Listing updated!")
    res.redirect(`/listing/${id}`);
})
);

//DELETE ROUTE
router.delete("/:id", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect('/listing');
})
);

module.exports = router;