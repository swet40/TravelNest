const Listing = require("../models/listings");
const opencage = require("opencage-api-client");
require('dotenv').config();

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

module.exports.createListing = async (req, res, next) => {
    const opencage = require('opencage-api-client');

    // Geocode the location
    opencage
        .geocode({ q: req.body.listing.location, key: process.env.OPENCAGE_API_KEY })
        .then(async (data) => {
            if (data.status.code === 200 && data.results.length > 0) {
                const place = data.results[0];
                const { lat, lng } = place.geometry;

                // Save the listing with coordinates
                const newListing = new Listing(req.body.listing);
                newListing.owner = req.user._id;
                newListing.image = { url: req.file.path, filename: req.file.filename };
                newListing.coordinates = { lat, lng }; // Add coordinates to the listing
                await newListing.save();

                // Pass success message and coordinates back to client
                req.flash("success", "New listing created");
                res.redirect('/listing');
            } else {
                console.log('Status', data.status.message);
                res.redirect('/listing');
            }
        })
        .catch((error) => {
            console.log('Error:', error.message);
            res.redirect('/listing');
        });

        allListings.forEach(listing => {
            if (listing.coordinates) {
                L.marker([listing.coordinates.lat, listing.coordinates.lng]).addTo(map)
                    .bindPopup(`<b>${listing.location}</b>`)
                    .openPopup();
            }
        });
        


    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
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