const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const depositItemSchema = new Schema({
  player: { type: String, required: true },
  item: { type: String, required: true },
  enchantment: { type: String, default: "0" },
  quality: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'pending'}
});

depositItemSchema.index({ date: 1 }, { expireAfterSeconds: 2592000 });

const depositItem = mongoose.model('depositItem', depositItemSchema);

module.exports = depositItem;