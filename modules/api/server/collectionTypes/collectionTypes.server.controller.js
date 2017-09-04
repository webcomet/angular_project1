'use strict';

/**
 * Module dependencies
 */
var errorHandler = require('../errors.server.controller');
var mongoose = require('mongoose');
var CollectionTypes = mongoose.model('CollectionTypes');
var Collection = mongoose.model('Collections');

exports.saveType = saveType;
exports.getTypes = getTypes;
exports.deleteType = deleteType;
exports.getTypeById = getTypeById;
var defaultType = new Array('YEARS', 'GENRE');
var defaultSlug = new Array('year_slug', 'genre_slug');
var date = new Date();
var year = date.getFullYear();
var YEARS_Collection = new Array(year, year + 1);
var YEARS_CollectionSlug = new Array(year + '_slug', year + 1 + '_slug');
var GENRE_Collection = new Array('Drama', 'Action', 'Documentary Feature', 'Documentary Short', 'Narrative Feature', 'Narrative Short');
var GENRE_CollectionSlug = new Array('drama_slug', 'action_slug', 'documentary_feature_slug', 'documentary_short_slug', 'narrative_feature_slug', 'narrative_short_slug');

// For saving collection type
function saveType(req, res, next) {
  if (req.body.festivalId) {
    if (req.body._id) {
      updateType(req, res, next);
    }else {
      var type = new CollectionTypes(req.body);
      save(type, res, next);
    }
  }else {
    return res.status(400).send({
      message: 'Festival id is required.'
    });
  }
}
function save(type, res, next) {
  checkUniqueTypeTitle(type.festivalId, type.typeTitle, type._id, res, checkUniqueTypeTitleCallback);
  function checkUniqueTypeTitleCallback(response) {
    if (response) {
      checkUniqueTypeSlug(type.festivalId, type.typeSlug, type._id, res, checkUniqueTypeSlugCallback);
    } else {
      return res.status(400).send({
        message: 'Type title must be unique.'
      });
    }
  }
  function checkUniqueTypeSlugCallback(responseSlug) {
    if (responseSlug) {
      type.save(saveCollectionTypeCallback);
    } else {
      return res.status(400).send({
        message: 'Type slug must be unique.'
      });
    }
    function saveCollectionTypeCallback(err, collectionTypeData) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(collectionTypeData);
    }
  }
}
// for fetching all types and collections
function getTypes(req, res, next) {
  var festivalId = req.query.festivalId || null;
  if (festivalId) {
    CollectionTypes.find({ festivalId: festivalId }).sort([['isDefault', 'desc']]).populate('collectionsId').exec(findCollectionTypeCallback);
  } else {
    return res.status(400).send({
      message: 'Festival id required.'
    });
  }
  function findCollectionTypeCallback(err, types) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (types.length === 0) {
        createDefaultType(req.query.festivalId, function typeSaveCallback(response) {
            getTypes(req, res, next);
        });
      } else {
        CollectionTypes.populate(types, { path: 'collectionsId.films.film', model: 'Film' }, findFilmsInCollectionCallback);
      }
    }
    function findFilmsInCollectionCallback(err, newType) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(newType);
    }
  }
}
// for fetching types by Id
function getTypeById(req, res, next) {
  var festivalId = req.query.festivalId || null;
  var id = req.query.id || null;
  if (festivalId && id) {
    CollectionTypes.findOne({ festivalId: festivalId, _id: id }, findCollectionTypeCallback);
  } else {
    return res.status(400).send({
      message: 'Festival id required.'
    });
  }
  function findCollectionTypeCallback(err, type) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(type);
    }
  }
}
// For saving default type and collection
function createDefaultType(festivalId, callback) {
  CollectionTypes.findOne({ festivalId: festivalId, isDefault: true }, findCollectionTypeCallback);
  function findCollectionTypeCallback(err, type) {
    if (err) {
      return callback(false);
    } else {
      if (!type) {
        defaultType.forEach(function (defaultTypeName, index, arr) {
          var type = new CollectionTypes();
          type.festivalId = festivalId;
          type.typeTitle = defaultTypeName;
          type.typeSlug = defaultSlug[index];
          type.isDefault = true;
          type.save(function (err, savedType) {
            if (err) {
              return errorHandler.getErrorMessage(err);
            } else {
              if (defaultTypeName === 'YEARS') {
                yearCollection(festivalId, savedType, collectionCallback);
              } else if (defaultTypeName === 'GENRE') {
                genreCollection(festivalId, savedType, collectionCallback);
              }
            }
            function collectionCallback(response) {
              if (response) {
                if (index === defaultType.length - 1) {
                  return callback(true);
                }
              }
            }
          });
        });       
      } else{
        return callback(true);
      }
    }
  }
}
function yearCollection(festivalId, savedType, callback) {
  YEARS_Collection.forEach(function (defaultCollection, index_c, arr_c) {
    var collection = new Collection();
    collection.festivalId = festivalId;
    collection.collectionTitle = defaultCollection;
    collection.collectionSlug = YEARS_CollectionSlug[index_c];
    collection.collectionTypeId = savedType._id;
    collection.isDefault = true;
    collection.save(function (err, collectionsNew) {
      if (err) {
        return callback(errorHandler.getErrorMessage(err));
      } else {
        CollectionTypes.update({ _id: savedType._id }, { $push: { collectionsId: collectionsNew } }, function updateCollectionTypeCallback(err, response) {
          if (index_c === YEARS_Collection.length - 1) {
            return callback(response);
          }
        });
      }
    });
  });
}
function genreCollection(festivalId, savedType, callback) {
  GENRE_Collection.forEach(function (defaultCollection, index_c, arr_c) {
    var collection = new Collection();
    collection.festivalId = festivalId;
    collection.collectionTitle = defaultCollection;
    collection.collectionSlug = GENRE_CollectionSlug[index_c];
    collection.collectionTypeId = savedType._id;
    collection.isDefault = true;
    collection.save(function (err, collectionsNew) {
      if (err) {
        return callback(errorHandler.getErrorMessage(err));
      } else {
        CollectionTypes.update({ _id: savedType._id }, { $push: { collectionsId: collectionsNew } }, function updateCollectionTypeCallback(err, response) {
          if (index_c === GENRE_Collection.length - 1) {
            return callback(response);
          }
        });
      }
    });
  });
}

// for deleting type
function deleteType(req, res, next) {
  var festivalId = req.query.festivalId || null;
  var typeId = req.query.id || null;
  if (festivalId) {
    CollectionTypes.findOne({ festivalId: festivalId, _id: typeId }, findCollectionTypeCallback);
  } else {
    return res.status(400).send({
      message: 'Festival id required.'
    });
  }
  function findCollectionTypeCallback(err, type) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      type.remove({}, function (err, type) {
        if (!err) {
          Collection.remove({ "_id": { "$in": type.collectionsId } }).exec(function resolveDelete(err, res) {
          });
        }
        res.json(type);
      });
    }
  }
}
// For updating type
function updateType(req, res, next){
  CollectionTypes.findOne({ festivalId: req.body.festivalId, _id: req.body._id }, findCollectionTypeCallback);
  function findCollectionTypeCallback(err, type) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      type.typeTitle = req.body.typeTitle;
      type.typeSlug = req.body.typeSlug;
      type.updated = Date.now();
      save(type, res, next);
    }
  }
}
// Function for checking duplicate title of type festivalId vise
function checkUniqueTypeTitle(festivalId, title, id, res, callback){
  CollectionTypes.find({ festivalId: festivalId, typeTitle: title, _id: { $ne: id } }, findCollectionTypeCallback);
  function findCollectionTypeCallback(err, typeT) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      if (typeT.length) {
        return res.status(400).send({
          message: 'Type title must be unique.'
        });
      }else{
        return callback(true);
      }
    } 
  }
}
// Function for checking duplicate slug of type festivalId vise
function checkUniqueTypeSlug(festivalId, slug, id, res, callback){
  CollectionTypes.find({ festivalId: festivalId, typeSlug: slug, _id: { $ne: id } }, findCollectionTypeCallback);
  function findCollectionTypeCallback(err, typeC) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (typeC.length) {
        return res.status(400).send({
          message: 'Type slug must be unique.'
        });
      } else {
        return callback(true);
      }
    }
  }
}
