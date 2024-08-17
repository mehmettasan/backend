const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  tradeHistory: { type: Array, default: [] },
  silverBalance: { type: Number, default: 0 },
  isVerifiedAccount: { type: Boolean, default: false },
  depositAccessIsland: { type: String, default: "" },
  pendingWithdraw: { type: Array, default: [] },
  server: { type: String, default: "" },
  isVerifiedAccount: { type: Boolean, default: false },
  emailVerificitionLink:{type:String , default:""},
  forgotPassword:{type:String , default:""}
});

// Şifreyi kaydetmeden önce hash'ler
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Şifre doğrulama yöntemi
UserSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
