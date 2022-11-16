const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Student = require('../models/student');
const Assignment = require('../models/assignment');

//Get all
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get one
router.get('/:id', getCourse, (req, res) => {
  res.json(res.course);
});

//Create One
router.post('/', async (req, res) => {
  const course = new Course({
    level: req.body.level,
    year: req.body.year,
    division: req.body.division,
    schoolYear: req.body.schoolYear,
  });
  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//update all

router.patch('/', async (req, res) => {
  let Courses;
  try {
    Courses = await Course.updateMany(
      { year: { $lt: 6 } },
      {
        $inc: { year: 1, schoolYear: 1 },
      }
    );
    await Course.findOneAndUpdate(
      {
        $and: [{ year: 6 }, { level: 'PRIMARIA' }],
      },
      {
        year: 1,
        level: 'SECUNDARIA',
        $inc: { schoolYear: 1 },
      }
    );
    res.json({ message: 'updated succesfully' });
  } catch (error) {
    res.json({ message: error });
  }
});

//Update One
router.patch('/:id', getCourse, async (req, res) => {
  if (req.body.level != null) {
    res.course.level = req.body.level;
  }
  if (req.body.year != null) {
    res.course.year = req.body.year;
  }
  if (req.body.division != null) {
    res.course.division = req.body.division;
  }

  try {
    const updatedCourse = await res.course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete one
router.delete('/:id', getCourse, async (req, res) => {
  let messages = {};
  const Assignments = await Assignment.find({
    course: req.params.id,
  });
  if (Assignments.length > 0) {
    messages.assignment_error = 'El curso aun tiene materias asignadas';
  }
  const Students = await Student.find({
    course: req.params.id,
  });
  if (Students.length > 0) {
    messages.student_error = 'El curso aun tiene alumnos asignados';
  }

  if (Students.length === 0 && Assignments.length === 0) {
    try {
      await res.course.remove();
      res.json({ message: 'Deleted course' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.json({ messages });
  }
});

//Get students in course

router.get('/students/:id', async (req, res) => {
  let students;
  let assignments;
  try {
    students = await Student.find({
      course: req.params.id,
    });
    assignments = await Assignment.find({
      course: req.params.id,
    }).populate('teacher');
    res.json({ students: students, assignments: assignments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

async function getCourse(req, res, next) {
  let course;
  try {
    course = await Course.findById(req.params.id);
  } catch (error) {
    if (course == null) {
      return res.status(404).json({ message: 'course not found' });
    } else {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  res.course = course;
  next();
}

module.exports = router;
