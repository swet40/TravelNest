const Listing = require("../models/listings")
const Review = require("../models/review")


module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new  Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review added!");
    res.redirect(`/listing/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewID} = req.params;

    await Review.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`)
}