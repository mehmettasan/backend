const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  registrationDate: { type: Date, default: Date.now },
  tradeHistory: { type: Array, default: [] },
  silverBalance: { type: Number, default: 0 },
  isVerifiedAccount: { type: Boolean, default: false },
  depositAccessIsland: { type: String, default: "" },
  pendingWithdraw: { type: Array, default: [] },
  waitingWithdraw: { type: Array, default: [] },
  server: { type: String, default: "", trim: true, required: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificitionLink: { type: String, default: "" },
  forgotPassword: { type: String, default: "" },
  banned:{ type: Boolean, default: false }
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
