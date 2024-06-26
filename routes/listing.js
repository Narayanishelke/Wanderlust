const express=require("express")
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const Listing=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controllers/listings.js")
const multer=require("multer")
const { storage }=require("../cloudConfig.js")
const upload=multer({ storage })


//COMBINATION
router
    .route("/")
    .get(wrapAsync (listingController.index))//INDEX ROUTE
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    ) //CREATE ROUTE PART 2
    


//NEW LISTINGS
router.get("/new",isLoggedIn, listingController.renderNewForm)

router
    .route("/:id")
    .get(wrapAsync (listingController.showListing))//SHOW ROUTE - PART 1 
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync (listingController.updateListing))//Update Route - PART 2
    .delete(isLoggedIn,isOwner,wrapAsync (listingController.destroyListing//DELETE ROUTE
));

//Edit Route - PART 1
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;





