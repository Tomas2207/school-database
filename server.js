if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

const cors = require('cors');

const session = require('cookie-session');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const Admin = require('./models/admin');

const bodyParser = require('body-parser');

//Middleware

app.use(
  cors({
    origin: 'https://school-database.netlify.app', //where react app is hosted
    credentials: true,
  })
);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(
  session({
    name: '__session',
    keys: ['key1'],
    maxAge: 24 * 60 * 60 * 100,
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  })
);

app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//End of middleware

//mongoose
const mongoose = require('mongoose');
const mongoDb = process.env.DATABASE_URL;
mongoose.connect(mongoDb, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'));
//*

app.use(express.json());

//passport routes

app.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) res.json('Administrador No Existe');
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json('Successfully Authenticated');
        console.log(req.user);
      });
    }
  })(req, res, next);
});
app.post('/register', async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username });

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (admin == null) {
    const newAdmin = new Admin({
      username: req.body.username,
      password: hashedPassword,
      name: req.body.name,
      lastname: req.body.lastname,
    });
    res.json({ message: 'Nuevo Administrador creado' });
    await newAdmin.save();
  } else {
    res.json({ message: 'El Usuario Ya Existe' });
  }
});

app.get('/user', (req, res) => {
  console.log('req.user', req.user);
  res.json(req.user);
});

app.get('/log-out', (req, res, next) => {
  try {
    req.logout();
    delete req.session;
    delete req.user;
  } catch (error) {
    res.json({ message: error.message });
  }
  res.json('Succesfully logged out');
});

//routes

const teachersRouter = require('./routes/teachers');
const courseRouter = require('./routes/courses');
const studentRouter = require('./routes/students');
const assignmentRouter = require('./routes/assignments');
const signRouter = require('./routes/sign');
const gradesRouter = require('./routes/grades');

app.use('/teacher', teachersRouter);
app.use('/course', courseRouter);
app.use('/student', studentRouter);
app.use('/assignment', assignmentRouter);
app.use('/sign', signRouter);
app.use('/grades', gradesRouter);

app.listen(process.env.PORT || 5000, () => console.log('Server started'));
