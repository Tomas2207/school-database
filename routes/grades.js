const express = require('express');
const router = express.Router();
const Gradesheet = require('../models/gradesheet');
const Grade = require('../models/grade');

//get one gradesheets

router.get('/:id', async (req, res) => {
  try {
    const gradesheet = await Gradesheet.find({ student: req.params.id })
      .populate('assignment')
      .populate('student')
      .populate('grades');
    res.json(gradesheet);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//get one
//create one gradesheet
router.post('/', async (req, res) => {
  try {
    const newGradesheet = new Gradesheet({
      year: req.body.year,
      assignment: req.body.assignment,
      student: req.body.student,
    });
    await newGradesheet.save();

    res.json(newGradesheet);
  } catch (error) {
    res.json({ message: error });
  }
});

//delete gradesheet
router.delete('/:id', async (req, res) => {
  try {
    const gradesheet = await Gradesheet.findById(req.params.id);
    await gradesheet.remove();
    res.json({ message: 'Deleted gradesheet' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update one
//delete one

//create grade

router.post('/:id/grade', async (req, res) => {
  try {
    const newGrade = new Grade({
      name: req.body.name,
      grade: req.body.grade,
    });

    await newGrade.save();

    await Gradesheet.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { grades: newGrade.id } }
    );

    // res.json(newGrade);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
