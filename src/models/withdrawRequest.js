const mongoose = require("mongoose");


const WithdrawRequestSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  items: [
    {
      itemName: { type: String, required: true, trim: true },
      itemTier: { type: String, required: true, trim: true },
      itemQuality: { type: String, required: true, trim: true },
      itemPrice: { type: Number, required: true },
      itemEnchant: { type: Number, required: true },
      itemImage: { type: String, required: true, trim: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const WithdrawRequest = mongoose.model("WithdrawRequest", WithdrawRequestSchema);
module.exports = WithdrawRequest;