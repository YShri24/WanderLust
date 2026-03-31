const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError");

// INDEX
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// SHOW
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing doesn't exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// CREATE
module.exports.createListing = async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;

    if (req.file) {
        newlisting.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await newlisting.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// UPDATE
module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid data");
    }

    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { new: true }
    );

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};