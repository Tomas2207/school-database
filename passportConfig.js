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
    console.log('*** serializeUser called, user: ');
    console.log(user); // the whole raw user object!
    console.log('---------');
    done(null, { _id: user._id });
  });

  passport.deserializeUser(async (id, done) => {
    console.log('deserialize');
    Admin.findById(id)
      .then((user) => {
        console.log('***deserialize user, user: ');
        console.log(user);
        done(null, user);
      })
      .catch((err) => {
        console.error(err);
        done(err);
      });
  });
};
