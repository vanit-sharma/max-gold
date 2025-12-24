const mongoose = require('mongoose');

const TestRecordSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Record 2025-09-30T10:00:00.000Z"
  ts:   { type: Date,   required: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model('TestRecord', TestRecordSchema);
