'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        validator = require('validator');

/**
 * CollectionTypes schema
 */

var collectionTypesSchema = new Schema({
  typeTitle: {
    type: String,
    required: 'Type Name is required.'
  },
  typeSlug: {
    type: String,
    lowercase: true,
    trim: true,
    required: 'Type Slug is required.',
    match: /^[a-zA-Z0-9_-]*$/
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  collectionsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collections', unique: true, dropDups: true }],
  
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

mongoose.model('CollectionTypes', collectionTypesSchema);
