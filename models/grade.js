const mongoose = require('mongoose');

const gradeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Grade', gradeSchema);
