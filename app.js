// ===================================
// IMPORTS
// ===================================
// npm imports
const express = require("express");
const app = express(); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

// config imports
const config = require('./config');

// Route imports
const gameRoutes = require('./routes/games');
const commentRoutes = require('./routes/comments');
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');

// model imports
const Game = require('./models/game');
const Comment = require('./models/comment');
const User = require('./models/users');

// ===================================
// DEVELOPMENTS
// ===================================

// Morgan
app.use(morgan('tiny'));

// Seed the DB
// const seed = require('./utils/seed');
// seed();

// ===================================
// CONFIG
// ===================================

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true})); 

// Connect to DB
mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// Express Config
app.set("view engine","ejs");
app.use(express.static('public'));

// Express Session Config
app.use(expressSession({
	secret: "shjbskjnlkekjenskjndsklkmsdlkdsmsdmdsmrttttttedwnsd",
	resave: false,
	saveUninitialized: false
}));

// Method Override Config
app.use(methodOverride('_method'));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());   // Allows persistent sessions
passport.serializeUser(User.serializeUser()); // Encodes data into the session(passport-local-mongoose)
passport.deserializeUser(User.deserializeUser()); // Decodes data from the session
// const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy(User.authenticate()));

// Current User Middleware Config
app.use((req,res,next) =>{
	res.locals.user = req.user;
	next();
})

// Route Config
app.use("/games",gameRoutes);
app.use("/games/:id/comments",commentRoutes);
app.use("/",mainRoutes);
app.use("/",authRoutes);
// ===================================
// LISTEN
// ===================================

app.listen(3000, () => {
	console.log("yelp_games is running.....");
});