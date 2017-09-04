'use strict';

/**
 * Module dependencies
 */
var path = require('path');
var errorHandler = require(path.resolve('./modules/api/server/errors.server.controller'));
var festivalcontroller = require(path.resolve('./modules/api/server/festival/festival.server.controller'));
var mongoose = require('mongoose');
var InviteFilmmakerSchema = mongoose.model('InviteFilmmaker');
var config = require(path.resolve('./config/config')),
        sg = require('sendgrid')(config.sendgrid.clientSecret),
        validator = require('validator'),
        swig = require('swig');
var inviteURL = '/ffm/invite/filmmaker/';
var mailTemplate = "Hi {{first_name}},"+
"Use the secure link below to submit your film {{film_name}} to {{festival_name}}.";


exports.createNewInvite = createNewInvite;
exports.reInviteFilmmaker = reInviteFilmmaker;
exports.generateUniqueCode = generateUniqueCode;
exports.inviteAllFilmmaker = inviteAllFilmmaker;
exports.getInvitedFilmmakers = getInvitedFilmmakers;
exports.checkFilmmakerUniqueCode = checkFilmmakerUniqueCode;
exports.deleteSentInvite = deleteSentInvite;

// For adding new invite filmmaker through import csv
function inviteAllFilmmaker(req, res, next) {
  var filmmakersData = req.body;
  var responseData = [];
  var errorData =[];
  var count = 0;
  filmmakersData.forEach(function (filmmakerData, index, arr) {
    addNewInvite(filmmakerData, res, req.user, callback);
    function callback(response) {
      if (response.error) {
        var msg = 'Unable to send invite for filmmaker:' + filmmakerData.inviteEmail;
        errorData.push(msg);
      } else {
        responseData.push(response.data);
      }
      if (count === filmmakersData.length - 1) {
        if(errorData.length){
           return res.status(400).send({
            message: errorData
          });
        }
        res.json(responseData);
      }
      count++;
    }
  });
}

// For creating new InviteFilmmaker
function createNewInvite(req, res, next) {
  addNewInvite(req.body, res, req.user, callback);
  function callback(response) {
    if (response.error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(response.data) || 'Could not send mail, something went wrong.'
      });
    }
    res.json(response.data);
  }
}

// For adding new inviteFilmmaker
function addNewInvite(newInviteData, res, user, callback) {
  if (newInviteData.festivalId) {
    var inviteFilmmaker = new InviteFilmmakerSchema(newInviteData);
    inviteFilmmaker.uniqueCode = generateUniqueCode();
    inviteFilmmaker.save(inviteFilmmakerCallback);
  } else {
    return res.status(400).send({
      message: 'Festival id required.'
    });
  }
  function inviteFilmmakerCallback(err, result) {
    if (err) {
      return callback({ 'error': true, 'data': err });
    } else {
      sendMail(result, res, user, sendMailCallback);
    }
    function sendMailCallback(response) {
      if (!response.error) {
        return callback({ 'error': false, 'data': response.data });
      } else {
        return callback({ 'error': true, 'data': response.data });
      }
    }
  }
}

// For fetching already invited filmmakers
function getInvitedFilmmakers(req, res, next) {
  var festivalId = req.query.festivalId || null;
  InviteFilmmakerSchema.find({ festivalId: festivalId, invited: true }, findInvitedFilmmakersCallback);
  function findInvitedFilmmakersCallback(err, response) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(response);
  }
}

// For reinviting filmmaker
function reInviteFilmmaker(req, res, next) {
  var inviteFilmmakerData = req.body;
  if (Array.isArray(inviteFilmmakerData)) {
    inviteMultipleFilmmaker(req, inviteFilmmakerData, res);
  } else {
    sendMail(inviteFilmmakerData, res, req.user, sendMailCallback);
  }
  function sendMailCallback(response) {
    if (response.error) {
      return res.status(400).send({
        message: 'Could not send mail, something went wrong.'
      });
    } else {
      res.json(response.data);
    }
  }
}

// For inviting multiple filmmaker
function inviteMultipleFilmmaker(req, inviteFilmmakerData, res) {
  var countIndex = 0;
  inviteFilmmakerData.forEach(function (filmmaker, index, arr) {
    sendMail(filmmaker, res, req.user, sendMailCallback);
    function sendMailCallback(response) {
      if (response.error) {
        countIndex++;
        if (countIndex === inviteFilmmakerData.length - 1) {
          return res.status(400).send({
            message: 'Could not send mail, something went wrong.'
          });
        }
      } else {
        countIndex++;
        if (countIndex === inviteFilmmakerData.length - 1) {
          res.json(response.data);
        }
      }
    }
  });
}

// For sending mail
function sendMail(filmmaker, res, user, callback) {
  var toEmail = validator.escape(filmmaker.inviteEmail);
  var fromEmail = validator.escape(user.email);
  var link = config.sendgrid.inviteBaseUrl + inviteURL + filmmaker.uniqueCode;
  var filmTitle = filmmaker.filmTitle ? validator.escape(filmmaker.filmTitle) : 'FILM';
  var firstName = filmmaker.firstName ? filmmaker.firstName : 'Filmmaker';
  getFestivalName(filmmaker.festivalId, getFestivalNameCallback);
  function getFestivalNameCallback(response) {
    if (response.error) {
      return callback({ error: true, data: response.data });
    } else {
      var festivalName = response.data;
      var html = "Hi " + firstName + " Use the secure link below to submit your film " + filmTitle + " to " + festivalName + "." 
         + "<br>" + link;
      var request = sg.emptyRequest({
        method: 'POST',
        fromname: 'FESTV',
        path: '/v3/mail/send',
        body: {
          personalizations: [{
              to: [{
                  email: toEmail
                }],
              subject: "You've been invited to upload a film to " + festivalName || '',
              
            }],
          from: {
              email: fromEmail,
              name: "FESTV"
          },
          content: [{
              type: 'text/html', value: html
            }]
        }
      });
      sg.API(request, function (error, response) {
        if (error) {
          return callback({ 'error': true, 'data': error });
        } else {
          findInviteFilmmakerById(filmmaker, res, callback);
        }
      });
    }
  }

}

// For finding invite filmmaker and update filmmaker object
function findInviteFilmmakerById(filmmaker, res, callback) {
  InviteFilmmakerSchema.findById(filmmaker._id, findInviteFilmmakerByIdCallback);
  function findInviteFilmmakerByIdCallback(err, filmmakerData) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (filmmakerData) {
        filmmakerData.invited = true;
        filmmakerData.lastInvitedDate = Date.now();
        updateFilmmaker(filmmakerData, callback);
      }
    }

  }
}

// For updating inviteFilmmaker
function updateFilmmaker(filmmakerData, callback) {
  filmmakerData.save(savefilmmakerDataCallback);
  function savefilmmakerDataCallback(err, filmmaker) {
    if (err) {
      return callback({ 'error': true, 'data': err });
    } else {
      return callback({ 'error': false, 'data': filmmaker });
    }
  }
}

// For Generating unique code
function generateUniqueCode() {
  var N = 30;
  var uniqueCode = Array(N + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, N);
  InviteFilmmakerSchema.findOne({ uniqueCode: uniqueCode }, findFilmmakerByUniqueCodeCallback);
  function findFilmmakerByUniqueCodeCallback(err, response){
    if(response){
      generateUniqueCode();
    }
  }
  return uniqueCode;
}

// For checking unique code , if unique code exists or not?
function checkFilmmakerUniqueCode(req, res, next) {
  var filmmakerUniqueCode = req.query.filmmakerUniqueCode || null;
  InviteFilmmakerSchema.find({ uniqueCode: filmmakerUniqueCode, invited: true }, findfindFilmmakerUniqueCodeCallback);
  function findfindFilmmakerUniqueCodeCallback(err, response) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(response);
  }
}

function deleteSentInvite(req, res, next) {
  if (req.body.festivalId) {
    InviteFilmmakerSchema.findOne({ festivalId: req.body.festivalId, _id: req.body._id }, findInviteFilmmakerCallback);
  } else {
    return res.status(400).send({
      message: 'Festival id required.'
    });
  }
  function findInviteFilmmakerCallback(err, filmmaker) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      filmmaker.remove({}, deleteFilmmakerCallback);
    }
    function deleteFilmmakerCallback(err, filmmaker) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(filmmaker);
      }
    }
  }
}

function getFestivalName(festivalId, callback) {
  festivalcontroller.getFestival(festivalId, getFestivalCallback);
  function getFestivalCallback(response) {
    if (response.error) {
      return callback({ error: true, data: response.data });
    } else {
      return callback({ error: false, data: response.data.festivalName });
    }
  }
}
