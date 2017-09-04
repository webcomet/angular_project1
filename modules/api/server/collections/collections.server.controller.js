'use strict';

/**
 * Module dependencies
 */
var errorHandler = require('../errors.server.controller');
var mongoose = require('mongoose');
var Collection = mongoose.model('Collections');
var CollectionTypes = mongoose.model('CollectionTypes');
var Film = mongoose.model('Film');

exports.saveCollection = saveCollection;
exports.deleteCollection = deleteCollection;
exports.getCollectionById = getCollectionById;
exports.removeFilmFromCollection = removeFilmFromCollection;
exports.sortFilmsOfCollection = sortFilmsOfCollection;
exports.addFilmsToCollection = addFilmsToCollection;
// For saving collection
function saveCollection(req, res, next) {
  if (req.body.festivalId) {
    if (req.body._id) {
      updateCollection(req, res, next);
    } else {
      if (req.body.collectionTypeId) {
        addCollectionToType(req.body, res);
      }
    }
  } else {
    return res.status(400).send({
      message: 'Festival id required.'
    });
  }
}
// for deleting collection
function deleteCollection(req, res, next) {
  var festivalId = req.query.festivalId || null;
  var typeId = req.query.typeId || null;
  var id = req.query.id || null;
  if (festivalId) {
    Collection.findOne({ festivalId: festivalId, collectionTypeId: typeId, _id: id }, findCollectionCallback);
  } else {
    return res.status(400).send({
      message: 'Festival id required.'
    });
  }
  function findCollectionCallback(err, collection) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      collection.remove({}, deleteCollectionCallback);
    }
    function deleteCollectionCallback(err, collection) {
      if (!err) {
        CollectionTypes.update({ _id: { $in: collection.collectionTypeId } }, { $pull: { collectionsId: collection._id } },
        function updateCollectionTypeCallback(err, numberAffected) {
        });
        res.json(collection);
      }
    }
  }
}
// for getting collection by id
function getCollectionById(req, res, next) {
  var festivalId = req.query.festivalId || null;
  var typeId = req.query.typeId || null;
  var id = req.query.id || null;
  if (festivalId && typeId && id) {
    Collection.findOne({ festivalId: festivalId, collectionTypeId: typeId, _id: id }, findCollectionCallback);
  } else {
    return res.status(400).send({
      message: 'Festival id required.'
    });
  }
  function findCollectionCallback(err, collection) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(collection);
    }
  }
}
// for updating collection
function updateCollection(req, res, next) {
  Collection.findOne({ festivalId: req.body.festivalId, collectionTypeId: req.body.collectionTypeId, _id: req.body._id }, updateCollectionCallback);
  function updateCollectionCallback(err, collection) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      collection.collectionTitle = req.body.collectionTitle;
      collection.collectionSlug = req.body.collectionSlug;
      collection.collectionTypeId = req.body.collectionTypeId;
      collection.updated = Date.now();
      addCollectionToType(collection, res, true);
    }
  }
}
// For saving collection
function addCollectionToType(postData, res, update) {
  var collection;
  CollectionTypes.findOne({ festivalId: postData.festivalId, _id: postData.collectionTypeId }, findCollectionTypeCallback);
  function findCollectionTypeCallback(err, type) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (type) {
        if (update) {
          collection = postData;
        } else {
          collection = new Collection(postData);
        }
        collection.collectionTypeId = type._id;
        checkUniqueCollectionTitle(collection.festivalId, collection.collectionTitle, collection._id, res, checkUniqueCollectionTitleCallback);
      }
    }
    function checkUniqueCollectionTitleCallback(response) {
      if (response) {
        checkUniqueCollectionSlug(collection.festivalId, collection.collectionSlug, collection._id, res, checkUniqueCollectionSlugCallback);
      } else {
        return res.status(400).send({
          message: 'Collection title must be unique.'
        });
      }
    }
    function checkUniqueCollectionSlugCallback(responseSlug) {
      if (responseSlug) {
        collection.save(collectionSaveCallback);
      } else {
        return res.status(400).send({
          message: 'Collection slug must be unique.'
        });
      }
      function collectionSaveCallback(err, CollectionData) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        if (!update) {
          CollectionTypes.update({ _id: type._id }, { $push: { collectionsId: CollectionData } }, function resolve(response) {
          });
        }
        res.json(CollectionData);
      }
    }
  }
}
// Function for checking duplicate title of collection festivalId vise
function checkUniqueCollectionTitle(festivalId, title, id, res, callback){
  Collection.find({ festivalId: festivalId, collectionTitle: title, _id: { $ne: id } }, findCollectionTypeCallback);
  function findCollectionTypeCallback(err, collectionC) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (collectionC.length) {
        return res.status(400).send({
          message: 'Collection title must be unique.'
        });
      } else {
        return callback(true);
      }
    }
  }
}
// Function for checking duplicate slug of collection festivalId vise
function checkUniqueCollectionSlug(festivalId, slug, id, res, callback){
  Collection.find({ festivalId: festivalId, collectionSlug: slug, _id: { $ne: id } }, findCollectionTypeCallback);
  function findCollectionTypeCallback(err, collectionC) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (collectionC.length) {
        return res.status(400).send({
          message: 'Collection slug must be unique.'
        });
      } else {
        return callback(true);
      }
    }
  }
}
// For sorting films
function sortFilmsOfCollection(req, res, next){
  var films = req.body.films;
  Collection.findById({ _id: req.body._id }, findCollectionCallback);
  function findCollectionCallback(err, collection) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var filmsArray = removeDuplicateFilms(films);
      collection.films = filmsArray;
      collection.save(function (err, updatedCollection) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        res.json(updatedCollection);
      });
    }
  }
}

// for removing duplicate films
function removeDuplicateFilms(films) {
  var filmId = [];
  var filmsArray = [];
  films.forEach(function (film, index, arr) {
    filmId.push(film.film._id);
    delete film._id;
  });
  var uniqueFilms = filmId.filter(function (elem, pos) {
    return filmId.indexOf(elem) === pos;
  });

  films.forEach(function (film, index, arr) {
    uniqueFilms.forEach(function (film1, index1, arr1) {
      if (film1 === film.film._id) {
        filmsArray.push(film);
        delete uniqueFilms[index1];
      }
    });
  });
  return filmsArray;
}
// For adding films to collection.
function addFilmsToCollection(req, res) {
  var films = req.body.films;
  films.forEach(function (film, index, arr) {
    if (!film._id) {
      Collection.update({ _id: req.body._id }, { $push: { films: { film: film.film, sort: film.sort } } }, addFilmsToCollectionCallback);
    }
    function addFilmsToCollectionCallback(err, response) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        Film.update({ _id: film._id }, { $push: { collections: req.body._id } }, function (err, response) {
        });
        if (index === films.length - 1) {
          res.json(response);
        }
      }
    }
  });
  
}
function removeFilmFromCollection(req, res, next){
  Collection.update({ _id: req.body.collection._id }, { $pull: { films: { film: req.body.films._id } } }, function (err, response) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Film.update({ _id: req.body.films._id }, { $pull: { collections: req.body.collection._id } }, function (err, response) {
      });
      res.json(response);
    }
  });
}
