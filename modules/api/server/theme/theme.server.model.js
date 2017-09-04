'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;
/**
 * Theme schema
 */
var ThemeSchema = new Schema({
  banner: {
    type: String
  },
  logo: {
    type: String
  },
  laurel: {
    type: String
  },
  festivalName: {
    type: String,
    required: 'Festival Name is required.'
  },
  festivalDate: {
    type: Date
  },
  festivalEndDate: {
    type: Date
  },
  festivalCity: {
    type: String
  },
  featuredCollection: {
    type: Number
  },
  about: {
    type: String
  },
  facebook: {
    type: String,
    lowercase: true,
    trim: true,
    match: /(^https?:\/\/)(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}/
  },
  twitter: {
    type: String,
    lowercase: true,
    trim: true,
    match: /(^https?:\/\/)(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}/
  },
  commenting: {
    type: Boolean
  },
  themeType: {
    type: String,
    enum: ['active', 'preview'],
    default: 'preview'
  },
  festivalId: {
    type: Schema.ObjectId,
    ref: 'Festival'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
});

mongoose.model('Theme', ThemeSchema);
