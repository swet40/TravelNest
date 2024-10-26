const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings");
const Review = require("../models/review.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const {validateReview} = require("../middleware.js");

//Reveiws
//post review route
router.post("/listing/:id/reviews", validateReview ,wrapAsync (async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new  Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review added!");
    res.redirect(`/listing/${listing._id}`);
}))

//Delete review route
router.delete("/listing/:id/reviews/:reviewID",
    wrapAsync(async(req,res)=>{
        let {id, reviewID} = req.params;

        await Review.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
        await Review.findByIdAndDelete(reviewID);
        req.flash("success","Review Deleted!");
        res.redirect(`/listing/${id}`)
    })
)

module.exports = router;