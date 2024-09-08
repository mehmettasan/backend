const mongoosse = require("mongoose");

const ItemSchema = new mongoosse.Schema({
  itemName: { type: String, required: true, trim: true },
  itemTier: { type: String, required: true, trim: true },
  itemQuality: { type: String, required: true, trim: true },
  itemPrice: { type: Number, required: true },
  itemEnchant: { type: Number, required: true },
  itemImage: { type: String, required: true, trim: true },
});

const Item = mongoosse.model("Item", ItemSchema);
module.exports = Item;
