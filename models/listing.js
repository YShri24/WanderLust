const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");

const ListingSchema=new Schema({
    title:{
        type:String,
        reqiuired:true,
    },    
    description: String,
    image:{
        filename:String,
        url:String
    }, 
    price:Number,
    location:String,
    country:String,
    owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    },
    
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }]
});
// CASCADE DELETE MIDDLEWARE
ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;