const Listing = require("../models/listing.js");

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// SHOW
module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
console.log("SHOW CONTROLLER HIT");
  res.render("listings/show.ejs", { listing });
};

// NEW
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// CREATE
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  // 🔥 HANDLE IMAGE FROM MULTER
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  // 🔐 OWNER
  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

// EDIT
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
   
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalImageUrl =listing.image.url;
  originalImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedData = req.body.listing;

  // If user provides image URL manually
  if (updatedData.image && updatedData.image.url) {
    updatedData.image = {
      url: updatedData.image.url,
      filename: "listingimage"
    };
  }

  // Update basic fields first
  let updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true
  });

  if (!updatedListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // If file uploaded (Multer)
  if (req.file) {
    updatedListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };

    await updatedListing.save(); // 🔥 IMPORTANT FIX
  }
console.log("UPDATE CONTROLLER HIT");
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};