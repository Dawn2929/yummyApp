const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const businessSchema = new Schema(
  {
    city: {type: String},
    password: {type: String},
    review_count: {type: Number},
    name: {type: String},
    business_id: {type: String},
    longitude:{type:Number},
    hours:{type:Object},
    state: {type: String},
    postal_code:{type: String},
    stars:{type: Number},
    address:{type: String},
    latitude:{type:Number},
    is_open:{type:Number},
    attributes:{type:Object},
    email:{type:String},
    categories:{type:String},
  },{collection:'business'}
);
//Create a model by schema
const Business = mongoose.model('business', businessSchema);

//Export the model
module.exports = Business;
