const User = require("../models").User;
const jwt = require("jsonwebtoken");
const transporter = require("../utils").transporter;
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { username, email, password, server } = req.body;

    const existingUsername = await User.findOne({ username,server });
    if (existingUsername) {
      return res.status(400).json({ error: "Bu kullanıcı adı bu sunucuda zaten kullanılıyor.\n Eğer bu sizin kullanıcı adınız ise lütfen bizimle iletişime geçiniz." });
    }

    // E-postanın mevcut olup olmadığını kontrol edin
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Bu e-posta adresi zaten kullanılıyor.\n Giriş yapabilirsiniz..." });
    }

    // Kullanıcıyı oluşturun
    const user = new User({
      username,
      email,
      password,
      server,
    });

    // Kullanıcıyı kaydedin
    await user.save();

    // JWT token oluşturun
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Doğrudan JWT token ile yanıt verin
    res.status(200).json({
      message: "Kayıt başarılı!",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};

//E posta doğrulama için eklenecek kısım
/*  // Doğrulama linki oluşturun ve kullanıcıya kaydedin
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
    user.emailVerificitionLink = verificationLink;
    await user.save();

    // E-posta gönderimi
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "E-posta Doğrulama",
      text: `Lütfen e-posta adresinizi doğrulamak için aşağıdaki bağlantıya tıklayın:\n\n${verificationLink}`,
    };

    transporter.sendMail(mailOptions);
    */

exports.eMailVerificition = async (req, res) => {
  const { token } = req.query;

  try {
    // JWT token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Kullanıcıyı bul ve doğrula
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ error: "Geçersiz veya süresi dolmuş doğrulama bağlantısı." });
    }

    user.isEmailVerified = true;
    user.emailVerificitionLink = ""; // Doğrulama linkini temizle
    await user.save();

    res
      .status(200)
      .json({ message: "E-posta adresiniz başarıyla doğrulandı!" });
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Kullanıcıyı e-posta adresi ile bulun
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Geçersiz e-posta veya şifre!" });
    }

    // Şifreyi kontrol edin
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Geçersiz e-posta veya şifre!" });
    }

    // Kullanıcı doğrulandıktan sonra JWT token oluşturun
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        server: user.server,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" } // Token 1 saat geçerli olacak
    );

    res.status(200).json({ message: "Giriş başarılı!", token });
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Kullanıcıyı e-posta adresi ile bulun
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
    }

    // JWT token oluşturun
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" } // Token 1 saat geçerli olacak
    );

    // Şifre sıfırlama linki oluşturun
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // E-posta gönderimi
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Şifre Sıfırlama",
      text: `Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n\n${resetLink}`,
    };

    transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!",
    });
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    // JWT token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Kullanıcıyı bulun
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ error: "Geçersiz veya süresi dolmuş bağlantı." });
    }

    // Yeni şifreyi hashleyin ve kaydedin
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Şifreniz başarıyla güncellendi!" });
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};
