const Item = require("../models").DepositItem;
const parseTextData = require("../utils").parseTextData;
const User = require("../models").User;

const getUsersWithPendingItems = async () => {
  try {
    // Kullanıcıların onaylanmamış itemlerini gruplamak için veritabanı sorgusu
    const items = await Item.find({ status: "pending" });

    // Kullanıcıları ve onaylanmamış itemlerini gruplayarak döndür
    const usersWithPendingItems = items.reduce((acc, item) => {
      if (!acc[item.player]) {
        acc[item.player] = [];
      }
      acc[item.player].push({
        item_name: item.item,
        quality: item.quality,
        enchantment: item.enchantment,
        amount: item.amount,
        date: item.date,
      });
      return acc;
    }, {});

    res.status(200).json({
      usersWithPendingItems,
    });
    return usersWithPendingItems;
  } catch (error) {
    res.status(500).json({ error: "bir hata oluştu" });
    console.error("Kullanıcıları ve itemleri çekme hatası:", error);
  }
};

exports.addItems = async (req, res) => {
  try {
    const { textData } = req.body; // Gelen text veriyi al
    const items = parseTextData(textData);
    for (const data of items) {
      const existingItem = await Item.findOne({
        player: data.player,
        item: data.item,
        enchantment: data.enchantment,
        quality: data.quality,
        amount: data.amount,
        date: data.date,
      });

      if (existingItem) {
        console.log("Aynı veri mevcut, ekleme yapılmadı:", existingItem);
        continue;
      }

      const newItem = new Item(data);
      await newItem.save();
    }
    res.status(200).json({ message: "başarıyla eklendi" });
  } catch (error) {
    res.status(500).json({ error: "bir hata oluştu" });
    console.error("Toplu veri ekleme hatası:", error);
  }
};

const approveItems = async (req, res) => {
  try {
    const { playerName, itemIds,balance } = req.body;
    await Item.updateMany(
      { _id: { $in: itemIds }, player: playerName, status: "pending" },
      { $set: { status: "approved" } }
    );
    res.status(200).json({ message: "işlem başarılı" });
  } catch (error) {
    res.status(500).json({ message: "bir hata oluştu" });
    console.error("Onaylama hatası:", error);
  }
};
