const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Gradesheet = require('../models/gradesheet');

//Get all
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get one
router.get('/:id', getStudent, (req, res) => {
  res.json(res.student);
});

//Create One
router.post('/', async (req, res) => {
  const student = new Student({
    name: req.body.name,
    lastname: req.body.lastname,
    course: req.body.course,
  });
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update One
router.patch('/:id', getStudent, async (req, res) => {
  if (req.body.name != null) {
    res.student.name = req.body.name;
  }
  if (req.body.lastname != null) {
    res.student.lastname = req.body.lastname;
  }
  if (req.body.course != null) {
    res.student.course = req.body.course;
  }
  try {
    const updatedStudent = await res.student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete one
router.delete('/:id', getStudent, async (req, res) => {
  try {
    const Gradesheets = await Gradesheet.deleteMany({
      student: req.params.id,
    });
    await res.student.remove();
    res.json({ message: 'Deleted student' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getStudent(req, res, next) {
  let student;
  try {
    student = await Student.findById(req.params.id);
  } catch (error) {
    if (student == null) {
      return res.status(404).json({ message: 'student not found' });
    } else {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  res.student = student;
  next();
}

module.exports = router;
