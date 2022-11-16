const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Teacher',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  currentYear: {
    type: Number,
    required: true,
  },
  calendarYear: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
