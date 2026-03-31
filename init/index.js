const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(async () => {
    console.log("connected");
    await initDB();
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  // 🔥 FIXED HERE
  const newData = data.data.map((obj) => ({
    ...obj,
    owner: "69c896538e5bb942e5026601",
  }));

  await Listing.insertMany(newData);

  console.log("Data was initialized");
};