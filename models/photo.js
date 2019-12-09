const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    caption: {type: String},
    photo_id: {type: String},
    business_id: {type: String},
    label: {type: String},
  },{collection:'photo'}
);
//Create a model by schema
const Photo = mongoose.model('photo', photoSchema);

//Export the model
module.exports = Photo;
