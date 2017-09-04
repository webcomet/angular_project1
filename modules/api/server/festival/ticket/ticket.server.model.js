'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Ticket Schema
 */
var TicketSchema = new Schema({
  title: {
    type: String,
    default: ''
  },
  festivalName: {
    type: Schema.ObjectId,
    ref: 'Festival'
  },
  description: {
    type: String
  },
  bannerS3url: {
    type: String
  },
  price: {
    type: Number
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  publicPurchase: {
    type: Boolean,
    default: false
  },
  tags: {
    type: Array
  },
  category: {
    type: Array
  },
  ticketType: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String
  },
  updated: {
    type: Date
  },
  updatedBy: {
    type: String
  }
});

mongoose.model('Ticket', TicketSchema);
