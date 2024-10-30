const Listing = require("../models/listings");
const axios=require("axios");
const opencage = require("opencage-api-client");

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

    let response;
    try {
        response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: req.body.listing.location,  // Location from user input
                format: 'json',
                limit: 1
            }
        });
    } catch (error) {
        console.error('Error during geocoding:', error);
        req.flash('error', 'Failed to geocode the location.');
        return res.redirect('/listings/new');
    }
    
    if (!response.data.length) {
        req.flash('error', 'No geocoding results found.');
        return res.redirect('/listings/new');
    }

    const geoData = response.data[0];
    const coordinates = [parseFloat(geoData.lon), parseFloat(geoData.lat)];


    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = {
        type: 'Point',
        coordinates: coordinates
    };
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
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_250,w_300");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async(req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image= {url,filename};
    await listing.save();
    }

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