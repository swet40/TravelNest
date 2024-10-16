const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings");
const Review = require("../models/review.js");
const {listingSchema, reviewSchema} = require("../schema.js");

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Reveiws
//post review route
router.post("/", validateReview ,wrapAsync (async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new  Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing._id}`);
}))

//Delete review route
router.delete("/:reviewID",
    wrapAsync(async(req,res)=>{
        let {id, reviewID} = req.params;

        await Review.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
        await Review.findByIdAndDelete(reviewID);

        res.redirect(`/listing/${id}`)
    })
)

module.exports = router;