const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkGameOwner = require("../utils/checkGameOwner");

// Index
router.get("/",async (req,res) => {
	console.log(req.user);
	try{
		const games = await Game.find().exec(); 
	    res.render("games",{games});
	}
	catch(err){
		console.log(err);
		res.send("you broke it.../index");
	}
});

// Create
router.post("/",isLoggedIn, async (req,res) => {
	const genre = req.body.genre.toLowerCase();
	const newGame = {
		title: req.body.title,
		description: req.body.description,
		developer: req.body.developer,
		publisher: req.body.publisher,
		date: req.body.date,
		engine: req.body.engine,
		platform: req.body.platform,
		genre,
		color: !!req.body.color,
		image: req.body.image,
		owner: {
			id: req.user._id,
			username: req.user.username
		}
	}
	
	try{
		const game = await Game.create(newGame);
		console.log(game);
		res.redirect("/games/" + game._id);;
	}
	catch(err){
		console.log(err);
		res.send("you broke it...../games POST");
	}	
});

// New
router.get("/new",isLoggedIn, (req,res) => {
	res.render("games_new");
});

// Search
router.get("/search", async(req,res) => {
	try{
		const games = await Game.find({
			$text: {
				$search: req.query.search
			}
		})
		res.render("games",{games});
	}
	catch(err){
		console.log(err);
		res.send("you broke it...../search GET");
	}
})

// Show
router.get("/:id",async (req,res) => {
	try{
			const game = await Game.findById(req.params.id).exec();
			const comments = await Comment.find({gameId: req.params.id});
			res.render("games_show",{game, comments});
	}
	catch(err){
		console.log(err);
		res.send("you broke it..../games/:id");
	}
});

// Edit
router.get("/:id/edit",checkGameOwner,async (req,res) => {

	const game = await Game.findById(req.params.id).exec();
	res.render("games_edit",{game}); 
});

// Update
router.put("/:id",checkGameOwner, async (req,res) =>{
	const genre = req.body.genre.toLowerCase();
	const gameBody = {
		title: req.body.title,
		description: req.body.description,
		developer: req.body.developer,
		publisher: req.body.publisher,
		date: req.body.date,
		engine: req.body.engine,
		platform: req.body.platform,
		genre,
		color: !!req.body.color,
		image: req.body.image
	}
	
	try{
		const game = await Game.findByIdAndUpdate(req.params.id, gameBody,{new: true}).exec();
		res.redirect("/games/" + req.params.id);
	}
	catch(err){
		console.log(err);
		res.send("you broke it..../game/:id PUT");
	}
})

// Delete
router.delete("/:id",checkGameOwner, async (req,res) => {
	try{
		const deletedGame = await Game.findByIdAndDelete(req.params.id).exec();
		console.log("Deleted: " + deletedGame);
		res.redirect("/games");
	}
	catch(err){
		console.log(err);
		res.send("you broke it..../game/:id DELETE");
	}
});

module.exports = router;