const Item = require('../models').Item; // Item modelini içe aktarın

// Yeni bir item oluşturma
exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Item oluşturulurken bir hata oluştu', error });
  }
};

// Tüm itemleri listeleme
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Itemler getirilirken bir hata oluştu', error });
  }
};

// ID'ye göre bir item getirme
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.body.id);
    if (!item) {
      return res.status(404).json({ message: 'Item bulunamadı' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Item getirilirken bir hata oluştu', error });
  }
};

// ID'ye göre bir item güncelleme
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item bulunamadı' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Item güncellenirken bir hata oluştu', error });
  }
};

// ID'ye göre bir item silme
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.body.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item bulunamadı' });
    }
    res.status(200).json({ message: 'Item başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Item silinirken bir hata oluştu', error });
  }
};

// Sayfaya göre item getirme
exports.getItemsByPage = async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1; // Gelen sayfa numarasını al, varsayılan olarak 1
      const limit = 50; // Her sayfa için gösterilecek item sayısı
      const skip = (page - 1) * limit; // Kaç item atlanacak
  
      const items = await Item.find().skip(skip).limit(limit); // Itemleri sayfalara göre getir
      const totalItems = await Item.countDocuments(); // Toplam item sayısını getir
      const totalPages = Math.ceil(totalItems / limit); // Toplam sayfa sayısını hesapla
  
      res.status(200).json({
        items,
        currentPage: page,
        totalPages,
        totalItems,
      });
    } catch (error) {
      res.status(500).json({ message: 'Sayfaya göre item getirilirken bir hata oluştu', error });
    }
  };
  
