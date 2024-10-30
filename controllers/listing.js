const Listing = require("../models/listings");
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
    // note that the library takes care of URI encoding
    const opencage = require('opencage-api-client');

opencage
    .geocode({ q: req.body.listing.location })
    .then((data) => {
        if (data.status.code === 200 && data.results.length > 0) {
            const place = data.results[0];
            const { lat, lng } = place.geometry;
            console.log("Formatted Address:",place.formatted);
            console.log("Latitude:", lat);
            console.log("Longitude:", lng);
            console.log("Timezone:",place.annotations.timezone.name);

            map.setView([lat, lng], 12); // Adjust zoom level as needed

                // Add a marker for the location
                L.marker([lat, lng]).addTo(map)
                    .bindPopup(`<b>${place.formatted}</b>`)
                    .openPopup();
                    
        } else {
            console.log('Status', data.status.message);
            console.log('Total results:', data.total_results);
        }
    })
    .catch((error) => {
        console.log('Error:', error.message);
        
        // Check if `status` exists before accessing `status.code`
        if (error.status && error.status.code === 402) {
            console.log('Hit free trial daily limit');
            console.log('Become a customer: https://opencagedata.com/pricing');
        } else {
            console.log('An unexpected error occurred.');
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