const express = require("express");
const router = express.Router();
const User = require("../models/users");
const passport = require('passport');

// Signup New
router.get("/signup",(req,res) =>{
	res.render("signup");
});

// Signup Create
router.post("/signup", async (req,res) =>{
	try{
		const newUser = await User.register(
			new User(
			{
				username: req.body.username,
				email: req.body.email
			}
		), 
		req.body.password
		);
		
		console.log(newUser);
		
		passport.authenticate('local')(req,res, () =>{
			res.redirect('/games');
		})
	}
	catch(err){
		console.log(err);
		res.send(err);
	} 
});

// Login -  Show Form
router.get("/login",(req,res) =>{
	res.render('login');
});

// Login
router.post("/login",passport.authenticate('local',{
	successRedirect: '/games',
	failureRedirect: '/login'
}));

// Logout
router.get("/logout",(req,res) =>{
	req.logout();
	res.redirect('/games');
});

module.exports = router;