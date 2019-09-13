var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');

var env = require('dotenv');
var exphbs = require('express-handlebars');

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For cors
app.use(cors());
app.options('*', cors());

// For Passport
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set('views', './app/views');
app.engine('hbs', exphbs({
    extname: '.hbs',
    layoutsDir: './app/views',
}));
app.set('view engine', '.hbs');

app.get('/', function(req, res) {
    res.send('Welcome to Passport with Sequelize');
});

//Models
var models = require("./app/models");

//Routes
require('./app/routes/auth.js')(app,passport);
require('./app/routes/api.js')(app,passport);

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.users);

//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});

app.listen(5000, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
});
