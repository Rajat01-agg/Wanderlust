const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// const tryData = require("./try.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to URL");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>
    (
        {
            ...obj,
            owner: "68ab2739ea3ac6b26aa0a2ea"
        }
    )
    );
    await Listing.insertMany(initData.data);
    console.log("Data Was Initialized");
}


initDB();