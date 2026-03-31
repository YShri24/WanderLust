const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// ADD REVIEW
module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  let newReview = new Review(req.body.review);

  // 🔥 attach author
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Review Added Successfully!");
  res.redirect(`/listings/${id}`);
};

// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}`);
};