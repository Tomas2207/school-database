const mongoose = require('mongoose');

const gradesheetSchema = mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Assignment',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student',
  },
  grades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grade',
    },
  ],
});

module.exports = mongoose.model('Gradesheet', gradesheetSchema);
