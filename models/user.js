const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    user_id: {type: String},
    name: {type: String},
    email: {type: String},
    password: {type: String},
    review_count: {type: Number},
    yelping_since: {type: String},
    friends:[String],
    useful:{type: Number},
    funny:{type: Number},
    cool:{type:Number},
    fans:{type:Number},
    elite:[Number],
    average_stars:{type:Number},
    compliment_hot:{type:Number},
    compliment_more: {type:Number},
    compliment_profile: {type:Number},
    compliment_list: {type:Number},
    compliment_note: {type:Number},
    compliment_plain: {type:Number},
    compliment_cool: {type:Number},
    compliment_funny: {type:Number},
    compliment_writer: {type:Number},
    compliment_photos: {type:Number},

  },{collection:'user'}
);
userSchema.methods.validPassword = function( pwd ) {
  // EXAMPLE CODE!
  return ( this.password === pwd );
};
//Create a model by schema
const User = mongoose.model('user', userSchema);

//Export the model
module.exports = User;
