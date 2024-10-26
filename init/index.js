const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");


const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
await mongoose.connect(mongo_url);
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,
        owner: "6700e909b912a563f344ee25"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();