const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  car_brand: { type: String, required: true },
  car_model: { type: String, required: true },
  //car_image: { type: Image, required: true },
  car_color: { type: String, required: true },
  car_transmission: { type: String, required: true },
  car_dimensions: { type: String, required: false },
  car_rent_min_price: { type: Number, required: false }
});

module.exports = mongoose.model('Car', carSchema);