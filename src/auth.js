const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

//register user into database
function register(username, email, password, errorCallback, successCallback) {

  //error case
  if (username.length < 8 || password.length < 8) {

    errorCallback({
      'message': "USERNAME PASSWORD TOO SHORT"
    });
  }

  //check if user already exists
  User.findOne({
    username: username
  }, (err, result) => {
    //determine if a User object was returned
    if (result) {
      errorCallback({
        'message': 'USERNAME ALREADY EXISTS'
      });
    } else {

			//salt and hash password, then save into password field
      bcrypt.hash(password, 10, function(err, hash) {
        const newUser = new User({
          username: username,
          email: email,
          password: hash
        });

				//save newUser
        newUser.save((err, user) => {

          if (err) {

            errorCallback({
              'message': "DOCUMENT SAVE ERROR"
            });
          }
          //success
          else {
            successCallback(newUser);
          }
        });


      });
    }
  });
}


//login function
function login(username, password, errorCallback, successCallback) {



  //find user with username that was passed in
  User.findOne({
    username: username
  }, (err, user) => {

    if (user) {

      //if user exists, compare with form password
      bcrypt.compare(password, user.password, (err, passwordMatch) => {

        //regenerate session if passwordMatch is true
        if (passwordMatch) {
          successCallback(user);

        } else {
          errorCallback({
            'message': "PASSWORDS DO NOT MATCH"
          });
        }
      });

    }

    //if user doesn't exist
    else {

      errorCallback({
        'message': "USER NOT FOUND"
      });
    }

  });

}

//callback: called after new session is created
function startAuthenticatedSession(req, user, cb) {

  //regenerate session id
  req.session.regenerate(function(err) {

    if (!err) {

      req.session.username = user;
      cb(req.session.user); //call callback function with userdata stored in session

    } else {
      cb(err); //call callback with error if an error occurs
    }


  });

}



module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};
