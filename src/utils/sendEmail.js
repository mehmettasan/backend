const nodemailer = require("nodemailer")
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Kendi e-posta sağlayıcınıza göre ayarlayın
    auth: {
        user: process.env.EMAIL_DOMAIN, // Gönderen e-posta adresi
        pass: process.env.EMAIL_PASSWORD // Gönderen e-posta şifresi
    }
});

module.exports=transporter