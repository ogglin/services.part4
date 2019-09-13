var authController = require('../controllers/authcontroller.js');
var passport = require('passport');

var multer = require('multer');
var multipart = multer();

module.exports = function (app) {
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.post('/signup', multipart.array(),
        function (req, res, next) {
            passport.authenticate('local-signup', (error, user , info) => {
                console.log(error, user , info);
                if (error) {
                    return next(error);
                }if (!user) {
                    return res.send(info);
                }
                res.send(user);
            })(req, res, next);
        }
    );
    app.post('/signin', multipart.array(),
        function (req, res, next) {
            passport.authenticate('local-signin', (error, user , info) => {
                console.log(error, user , info);
                if (error) {
                    return next(error);
                }if (!user) {
                    return res.send(info);
                }
                res.send(user);
            })(req, res, next);
        }
    );
    app.get('/logout', authController.logout);

};
