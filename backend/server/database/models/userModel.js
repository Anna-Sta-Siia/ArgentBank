const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:  { type: String, required: true },  // hashé
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  userName:  { type: String, default: '' },

  // ⬇️ NOUVEAU
  role: { type: String, enum: ['admin', 'demo'], default: 'demo', index: true },
}, {
  timestamps: true,
  toObject: { transform: (_, ret) => { ret.id = ret._id; delete ret._id; delete ret.password; delete ret.__v; return ret; } },
  toJSON:   { transform: (_, ret) => { ret.id = ret._id; delete ret._id; delete ret.password; delete ret.__v; return ret; } },
});

module.exports = mongoose.model('User', userSchema);
