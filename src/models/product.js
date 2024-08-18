const mongoosse = require("mongoose");

const ProductSchema = new mongoosse.Schema({
  productName: { type: String, required: true, trim: true },
  productDescription: { type: String },
  productTier: { type: String, required: true, trim: true },
  productQuality: { type: String, required: true, trim: true },
  productPrice: { type: Number, required: true },
  productImage: { type: String, required: true, trim: true },
});

const Product = mongoosse.model("Product", ProductSchema);
module.exports = Product;
