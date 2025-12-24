const mongoose = require('mongoose');
const BlacklistedTokenSchema = new mongoose.Schema({
  jti: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
});
BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-remove expired tokens
module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
