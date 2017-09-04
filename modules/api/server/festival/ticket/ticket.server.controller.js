'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var errorHandler = require('../../errors.server.controller');
var s3fsController = require('../../external-apis/s3.server.controller');
var Ticket = mongoose.model('Ticket');

exports.upload = s3fsController.upload;
exports.createUpdateTicket = createUpdateTicket;

function createUpdateTicket(req, res, next) {
  if(req.body._id) { //Update:
    var updateId = req.body._id;
    Ticket.findById(updateId, function(err, foundObj) {
      if (err) console.error(err);
      var ticket = syncTicketObject(foundObj, req);
      ticket.save(logError);
      res.json(ticket);
    });
  } else { // Create:
    var ticket = createTicketObject(req);
    ticket.save(logError);
    res.json(ticket);
  }
}

function logError(err) {
  if (err) console.error(err);
}

function createTicketObject(req) {
  var ticket = new Ticket();
  ticket = syncTicketObject(ticket, req);
  ticket.created = Date.now();
  ticket.createdBy = req.user._id.toString();
  return ticket;
}

function syncTicketObject(ticket, req) {
  ticket.title = req.body.title;
  ticket.festivalName = req.body.festivalName;
  ticket.description = req.body.description;
  ticket.bannerS3url = req.body.bannerS3url;
  ticket.price = req.body.price;
  ticket.startDate = req.body.startDate;
  ticket.endDate = req.body.endDate;
  ticket.publicPurchase = req.body.publicPurchase;
  ticket.tags = req.body.tags;
  ticket.category = req.body.category;
  ticket.ticketType = req.body.ticketType;
  ticket.updated = Date.now();
  ticket.updatedBy = req.user._id.toString();
  return ticket;
}
