'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        validator = require('validator');

/**
 * Collection schema
 */
var collectionsSchema = new Schema({
  collectionTitle: {
    type: String,
    required: 'Collection Name is required.'
  },
  collectionSlug: {
    type: String,
    lowercase: true,
    trim: true,
    required: 'Collection Slug is required.',
    match: /^[a-zA-Z0-9_-]*$/
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  festivalId: {
    type: Schema.ObjectId,
    ref: 'Festival'
  },
  collectionTypeId: {
    type: Schema.ObjectId,
    ref: 'CollectionTypes'
  },
  films: [{
      sort: { type: Number },
      film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film' }
    }],
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
});

mongoose.model('Collections', collectionsSchema);
