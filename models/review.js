const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    review_id: {type: String},
    user_id: {type: String},
    business_id: {type: String},
    stars: {type: Number},
    date: {type: String},
    text: {type: String},
    useful: {type: Number},
    funny: {type: Number},
    cool: {type: Number}
  },{collection:'review'}
);
//Create a model by schema
const Review = mongoose.model('review', reviewSchema);

//Export the model
module.exports = Review;





