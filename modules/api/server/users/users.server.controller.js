'use strict';

/**
 * Module dependencies
 */
var path = require('path');
var errorHandler = require('../errors.server.controller');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Festival = mongoose.model('Festival');

/**
 * update
 */
exports.put = function (req, res, next) {

	var putUserId = req.body._id;
	var userId = req.user._id.toString();

	if(userId !== putUserId){
		return res.status(403).json({
		  message: 'User is not authorized'
		});
	}

	User.findById(userId).then(userFound);
	function userFound(user, err){

		if (err) {
			res.send(err);
		}  

        user.firstName = req.body.firstName;  // update the users info
        user.lastName = req.body.lastName; 
        user.facebook = req.body.facebook; 
        user.twitter = req.body.twitter;
        user.imdb = req.body.imdb;

        // save the user
        user.save(saveUser);
        function saveUser(err){
        	if (err)
        	    res.send(err);

        	res.json({ message: 'User updated!' });
        }
	}
};
/*
 * Get festivals by userId
 */
exports.getFestivalByUserId = function (req, res) {
  // Get festival by userId
  var userId = req.params.userId;
  Festival.find({ createdBy: userId }).then(function (festival, err) {
    if (err) {
      res.json('');
    } else {
      res.json(festival);
    }
  });
};
