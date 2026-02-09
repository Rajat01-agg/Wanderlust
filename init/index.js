require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// const tryData = require("./try.js");

const MONGO_URL = process.env.DB_URL;

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Connected to URL");
})
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>
    (
        {
            ...obj,
            owner: '6989bfd219ab2e69b585342b'
        }
    )
    );
    await Listing.insertMany(initData.data);
    console.log("Data Was Initialized");
}


initDB();