const Listing = require("../models/listings");

module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new.ejs');
}

module.exports.showListing = async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate: {
        path: "author",
    },
})
    .populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist!");
        return res.redirect("/listing");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req,res,next) =>{
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect('/listing');
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you are searching for does not exist!");
        return res.redirect("/listing");
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing updated!")
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect('/listing');
}