const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.searchListings = async (req, res) => {
    const searchQuery = req.query.q;
    
    if (!searchQuery || searchQuery.trim() === "") {
        req.flash("error", "Please enter something to search!");
        return res.redirect("/listings");
    }
    
    // Search for listings where title, location, OR country matches the query (case-insensitive)
    const searchResults = await Listing.find({
        $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } },
            { country: { $regex: searchQuery, $options: 'i' } }
        ]
    });
    
    if (searchResults.length === 0) {
        req.flash("error", `No listings found for "${searchQuery}"`);
        return res.redirect("/listings");
    }
    
    res.render("listings/index.ejs", { allListings: searchResults });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate(
        {
            path: "reviews",
            populate:
                { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { listing });
    }
};

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    req.body.listing.geometry = response.body.features[0].geometry;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    } else {
        let originalImageURL = listing.image.url;
        originalImageURL = originalImageURL.replace("/upload", "/upload/h_300,w_250");
        res.render("listings/edit.ejs", { listing, originalImageURL });
    }
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};