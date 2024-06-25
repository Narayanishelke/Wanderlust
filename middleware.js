const Listing= require("./models/listing");
const expressError = require("./utils/expressError.js");
const {listingSchema, reviewSchema}= require("./schema.js");
const Review = require("./models/review");


module.exports.isLoggedIn =(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listings!");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl= (req, res, next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async(req, res, next)=>{
    let { id } = req.params;
  let listing= await Listing.findById(id);
   if (!res.locals.currUser && listing.owner.equals(res.locals.currUser._id)) {

    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing= (req, res, next) =>{
    let {error}= listingSchema.validate(req.body);
    if (error){
      let errMsg= error.details.map((el)=>el.message).join(",");
      throw new expressError (400, err.Msg);
    }else{
      next();
    }
  };


  module.exports.validateReview= (req, res, next) =>{
      let {error}= reviewReview.validate(req.body);
      if (error){
        let errMsg= error.details.map(el=>el.message).join(",");
        throw new expressError (400, err.Msg);
      }else{
        next();
      }
    };

    module.exports.isreviewAuthor= async(req, res, next)=>{
      let {id, reviewId } = req.params;
    let review= await Review.findById(id);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
  
    next();
  };