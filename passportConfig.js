const Admin = require('./models/admin');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      Admin.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result == true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log('deserialize');
    Admin.findById(id)
      .then((user) => {
        console.log(user);
        done(null, user);
      })
      .catch((err) => {
        console.error(err);
        done(err);
      });
  });
};
