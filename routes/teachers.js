const express = require('express');
const Assignment = require('../models/assignment');
const router = express.Router();
const Teacher = require('../models/teacher');

//Get all
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get one
router.get('/:id', getTeacher, (req, res) => {
  res.json(res.teacher);
});

//Create One
router.post('/', async (req, res) => {
  const teacher = new Teacher({
    name: req.body.name,
    lastname: req.body.lastname,
  });
  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update One
router.patch('/:id', getTeacher, async (req, res) => {
  if (req.body.name != null) {
    res.teacher.name = req.body.name;
  }
  if (req.body.lastname != null) {
    res.teacher.lastname = req.body.lastname;
  }
  try {
    const updatedTeacher = await res.teacher.save();
    res.json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete one
router.delete('/:id', getTeacher, async (req, res) => {
  const Assignments = await Assignment.find({
    teacher: req.params.id,
  });

  if (Assignments.length === 0) {
    try {
      await res.teacher.remove();
      res.json({ message: 'Deleted teacher' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.json({ errorMessage: 'Profesor/a tiene asignaturas a su nombre' });
  }
});

//find assignment with teacher

router.get('/:id/assignment', getTeacher, async (req, res) => {
  try {
    let assignment = await Assignment.find({
      teacher: res.teacher.id,
    })
      .populate('teacher')
      .populate('course');
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

async function getTeacher(req, res, next) {
  let teacher;
  try {
    teacher = await Teacher.findById(req.params.id);
  } catch (error) {
    if (teacher == null) {
      return res.status(404).json({ message: 'teacher not found' });
    } else {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  res.teacher = teacher;
  next();
}

module.exports = router;
