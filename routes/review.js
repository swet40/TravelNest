const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings");
const Review = require("../models/review.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js")

//Reveiws
//post review route
router.post("/listing/:id/reviews",
    isLoggedIn,
    validateReview ,wrapAsync (reviewController.createReview))

//Delete review route
router.delete("/listing/:id/reviews/:reviewID",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
)

module.exports = router;