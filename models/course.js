const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  level: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  division: {
    type: String,
    required: true,
  },
  schoolYear: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Course', courseSchema);
