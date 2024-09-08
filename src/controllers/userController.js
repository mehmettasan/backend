const User = require('../models').User; // User modelini içe aktarın
const jwt = require('jsonwebtoken'); // JWT işlemleri için

// 1. Kullanıcıya bakiye ekleme
exports.addBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body; // userId ve eklenmesi gereken miktar body'den alınır
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    user.silverBalance += amount;
    await user.save();
    res.status(200).json({ message: 'Bakiye başarıyla eklendi', balance: user.silverBalance });
  } catch (error) {
    res.status(500).json({ message: 'Bakiye eklenirken bir hata oluştu', error });
  }
};

// 2. Kullanıcıya bir deposit island verme
exports.addDepositIsland = async (req, res) => {
  try {
    const { userId, islandName } = req.body; // userId ve islandName body'den alınır
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    user.depositAccessIsland = islandName;
    await user.save();
    res.status(200).json({ message: 'Deposit island başarıyla verildi', depositAccessIsland: user.depositAccessIsland });
  } catch (error) {
    res.status(500).json({ message: 'Deposit island verilirken bir hata oluştu', error });
  }
};

// 3. Kullanıcı banlama
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.body; // userId body'den alınır
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    user.banned = true;
    await user.save();
    res.status(200).json({ message: 'Kullanıcı başarıyla banlandı' });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı banlanırken bir hata oluştu', error });
  }
};

// 4. Tüm kullanıcıları gösterme
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -emailVerificitionLink -forgotPassword');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcılar getirilirken bir hata oluştu', error });
  }
};

// 5. Sayfaya göre tüm kullanıcıları gösterme
exports.getUsersByPage = async (req, res) => {
  try {
    const { page = 1, sortField = 'registrationDate', sortOrder = 'desc' } = req.body; // Sayfa numarası ve sıralama bilgileri body'den alınır
    const limit = 50;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ [sortField]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .select('-password -emailVerificitionLink -forgotPassword');

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcılar getirilirken bir hata oluştu', error });
  }
};

// 6. Tüm kullanıcıların toplam bakiyesini gösteren fonksiyon
exports.getTotalBalance = async (req, res) => {
  try {
    const totalBalance = await User.aggregate([
      { $group: { _id: null, totalBalance: { $sum: '$silverBalance' } } },
    ]);
    res.status(200).json({ totalBalance: totalBalance[0]?.totalBalance || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Toplam bakiye hesaplanırken bir hata oluştu', error });
  }
};

// 7. Tek bir kullanıcının bilgilerini döndüren fonksiyon (şifre ve özel bilgiler hariç)
exports.getUserInfo = async (req, res) => {
  try {
    const {token} = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token'ı doğrula
    const userId = decoded.userId;

    const user = await User.findById(userId).select('-password -emailVerificitionLink -forgotPassword -registrationDate');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı bilgileri getirilirken bir hata oluştu' });
  }
};
