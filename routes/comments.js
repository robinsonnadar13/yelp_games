const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');
const Game = require("../models/game");
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require("../utils/checkCommentOwner");

// New Comment - Show Form	
router.get("/new",isLoggedIn, (req,res) =>{
	res.render("comments_new",{gameId: req.params.id});
});

// Create Comment - Actually Update DB
router.post("/", isLoggedIn, async (req,res) =>{
	try{
		const comment = await Comment.create({
		user: {
			id: req.user._id,
			username: req.user.username
		},
		text: req.body.text,
		gameId: req.body.gameId
	});
	console.log(comment);
	res.redirect("/games/" + req.body.gameId);
	}
	catch(err){
		console.log(err);
		res.send("you broke it...POST comments");
	}
});

// Edit Comment - Show the edit form
router.get("/:commentId/edit",checkCommentOwner, async(req,res) =>{
	try{
		const game = await Game.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		console.log("game: " + game);
		console.log("comment: " + comment);
		res.render("comments_edit",{game, comment});
	}
	catch(err){
		console.log(err);
		res.send("you broke it...Comment Edit GET");
	}
})

// Update Comment - Actually update in DB
router.put("/:commentId",checkCommentOwner, async(req,res) => {
	try{
		const comment = await Comment.findByIdAndUpdate(req.params.commentId,{text: req.body.text},{new: true}).exec();
		console.log(comment);
		res.redirect("/games/" + req.params.id);
	}
	catch(err){
		console.log(err);
		res.send("you broke it...Comment Edit PUT");
	}
})


// Delete Comment - 
router.delete("/:commentId", checkCommentOwner, async(req,res) => {
	try{
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		console.log(comment);
		res.redirect("/games/" + req.params.id);
	}
	catch(err){
		console.log(err);
		res.send("you broke it...Comment DELETE");
	}
});


module.exports = router;