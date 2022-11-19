const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment');
const Student = require('../models/student');
const Course = require('../models/course');
const Gradesheet = require('../models/gradesheet');

//Get all
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get one
router.get('/:id', getAssignment, (req, res) => {
  res.json(res.assignment);
});

//Create One
router.post('/', async (req, res) => {
  // const findAssignment = await Assignment.find({
  //   course: req.body.course,
  //   name: req.body.name,
  // }).exec();
  const assignment = new Assignment({
    name: req.body.name,
    teacher: req.body.teacher,
    course: req.body.course,
    currentYear: req.body.currentYear,
    calendarYear: req.body.calendarYear,
  });
  try {
    const newAssignment = await assignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  
});

//Update One
router.patch('/:id', getAssignment, async (req, res) => {
  if (req.body.name != null) {
    res.assignment.name = req.body.name;
  }
  if (req.body.teacher != null) {
    res.assignment.teacher = req.body.teacher;
  }
  if (req.body.course != null) {
    res.assignment.course = req.body.course;
  }
  try {
    const updatedAssignment = await res.assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete one
router.delete('/:id', getAssignment, async (req, res) => {
  try {
    await Gradesheet.deleteMany({ assignment: req.params.id });
    await res.assignment.remove();
    res.json({ message: 'Deleted assignment' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all students in assignment

router.get('/:id/students', getAssignment, async (req, res) => {
  try {
    let students = await Student.find({
      course: res.assignment.course,
    });
    res.json(students);
    // res.json(res.assignment.course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getAssignment(req, res, next) {
  let assignment;
  try {
    assignment = await Assignment.findById(req.params.id);
  } catch (error) {
    if (assignment == null) {
      return res.status(404).json({ message: 'assignment not found' });
    } else {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  res.assignment = assignment;
  next();
}

module.exports = router;
