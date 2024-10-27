const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listings");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

//index route
router.get('/',
    wrapAsync(listingController.index)
);

//new route
router.get('/new',isLoggedIn,listingController.renderNewForm)

//show route
router.get('/:id', wrapAsync(listingController.showListing)
);

//create route
router.post('/', isLoggedIn,
    wrapAsync(listingController.createListing)
)

//edit route
router.get('/:id/edit',isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.renderEditForm)
);

//update route
router.put("/:id",isLoggedIn,
    isOwner,
    wrapAsync(listingController.updateListing)
);

//DELETE ROUTE
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

module.exports = router;