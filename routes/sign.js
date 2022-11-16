const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');

router.post('/', async (req, res) => {
  let teacher;
  try {
    teacher = await Teacher.find({
      name: req.body.name,
      lastname: req.body.lastname,
    });
    if (teacher != null) {
      res.json(teacher);
    } else {
      res.json({ message: 'No encontrado' });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
