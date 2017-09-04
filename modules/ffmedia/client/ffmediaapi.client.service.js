(function ($, angular) {
  /**
   * @ngdoc service
   * @name ffmedia.ffmediaApi
   * @description
   * # ffmediaApi
   * Factory in ffmedia.
   */
  angular.module('ffmedia').factory('ffmediaApi', ffmediaApi);

  function ffmediaApi(
    $http
  ) {
    'use strict';

    var api = {}; // object returned from factory
    var apiCache = {};

    api.setup = function() {
      // setup api cache
      apiCache.someCache = null;
    };

    api.auth = function(authId) {

      var auth = {};

      auth.signout = function(signout) {
        var url = '/api/auth/signout';
        return $http.get(url);
      };

      return auth;
    };
    api.user = function(userObj) {

      var user = {};

      user.profile = function() {

        var profile = {};

        profile.update = function(signout) {
          var url = '/api/user/'+userObj._id+'/profile';
          return $http.put(url, userObj);
        };

        return profile;
      };
      user.festivals=function(){
         return $http({
          method: 'GET',
          url: '/api/user/' + userObj._id + '/festivals',
          headers: { 'Content-Type': 'application/json' }
        });
      };

      return user;
    };

    api.film = function(filmId) {

      var film = {};

      film.create = function(filmData) {
        return $http({
          method: 'POST',
          url: '/api/films/create',
          data: filmData,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.get = function() {
        return $http({
          method: 'GET',
          url: '/api/films/get?id='+filmId,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.ingestVideo = function(filmData) {
        return $http({
          method: 'POST',
          url: '/api/brightcove/ingest/video',
          data: filmData,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.ingestTeaser = function(filmData) {
        return $http({
          method: 'POST',
          url: '/api/brightcove/ingest/teaser',
          data: filmData,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.createTeaser = function(filmData) {
        return $http({
          method: 'POST',
          url: '/api/zencoder/createteaser',
          data: filmData,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.removeTeaser = function(filmData) {
        return $http({
          method: 'DELETE',
          url: '/api/films/teaser',
          data: filmData,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.removeVideo = function(filmData) {
        return $http({
          method: 'DELETE',
          url: '/api/films/video',
          data: filmData,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.progress = function(jobId) {
        return $http({
          method: 'GET',
          url: '/api/zencoder/progress?jobid='+jobId,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };
      film.getFilms = function() {
        return $http({
          method: 'GET',
          url: '/api/films/getFilms',
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };
      film.getFilmsByCollectionId = function(collectionId) {
        return $http({
          method: 'GET',
          url: '/api/films/getFilmsByCollectionId?collectionId=' + collectionId,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.count = function() {
        return $http({
          method: 'GET',
          url: '/api/films/count',
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.list = function(limit, offset) {
        if(!limit) limit = 5;
        if(!offset) offset = 0;
        return $http({
          method: 'GET',
          url: '/api/films/list?limit='+limit+"&offset="+offset,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };

      film.getAccountId = function() {
        return $http({
          method: 'GET',
          url: '/api/brightcove/accountid',
          headers: { 'Content-Type': 'application/json' }
        });
      };

      film.getBrightcoveVideoObject = function(vid) {
        return $http({
          method: 'GET',
          url: '/api/brightcove/video?videoid='+vid,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      };
      

      return film;
    };
    api.theme = function(festivalId) {

      var theme = {};
      theme.getActiveTheme = function(festivalId) {
        return $http({
          method: 'GET',
          url: '/api/theme/getActiveTheme?festivalId=' + festivalId,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      theme.getThemeForPreview = function(festivalId) {
        return $http({
          method: 'GET',
          url: '/api/theme/getThemeForPreview?festivalId=' + festivalId,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      theme.publishTheme = function(themeData) {
        return $http({
          method: 'POST',
          url: '/api/theme/publishTheme',
          data: themeData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      theme.savePreviewTheme = function(themeData) {
        return $http({
          method: 'POST',
          url: '/api/theme/savePreviewTheme',
          data: themeData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      theme.revertChanges = function(themeData) {
        return $http({
          method: 'POST',
          url: '/api/theme/revertChanges',
          data: themeData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      theme.deleteImageFromBucket = function(imageData) {
        return $http({
          method: 'POST',
          url: '/api/theme/deleteImageFromBucket',
          data: imageData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      return theme;
    };
    api.ticket = function(festivalId) {
      var ticket = {};
      ticket.saveTicket = function(ticketData) {
        return $http({
          method: 'POST',
          url: '/api/festival/ticket',
          data: ticketData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      return ticket;
    };

    api.collection = function() {

      var collection = {};
      collection.getTypes = function(festivalId) {
        return $http({
          method: 'GET',
          url: '/api/collectionTypes/getTypes?festivalId=' + festivalId,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      collection.saveType = function(typeData) {
        return $http({
          method: 'POST',
          url: '/api/collectionTypes/save',
          data: typeData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      collection.saveCollection = function(collectionData) {
        return $http({
          method: 'POST',
          url: '/api/collection/saveCollection',
          data: collectionData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      collection.sortFilmsOfCollection = function(collectionData) {
        return $http({
          method: 'POST',
          url: '/api/collection/sortFilmsOfCollection',
          data: collectionData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      collection.addFilmsToCollection = function(collectionData) {
        return $http({
          method: 'POST',
          url: '/api/collection/addFilmsToCollection',
          data: collectionData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      collection.deleteType = function(festivalId, ID) {
        return $http({
          method: 'DELETE',
          url: '/api/collectionTypes/deleteType?id=' + ID + '&festivalId=' + festivalId,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      collection.deleteCollection = function(festivalId, typeID, ID) {
        return $http({
          method: 'DELETE',
          url: '/api/collection/deleteCollection?typeId=' + typeID + '&id=' + ID + '&festivalId=' + festivalId,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      collection.getTypeByID = function(festivalId, ID) {
        return $http({
          method: 'GET',
          url: '/api/collectionTypes/getTypeById?id=' + ID + '&festivalId=' + festivalId,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      collection.getCollectionByID = function(festivalId, typeID, ID) {
        return $http({
          method: 'GET',
          url: '/api/collection/getCollectionById?typeId=' + typeID + '&id=' + ID + '&festivalId=' + festivalId,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      collection.removeFilmFromCollection = function(postData) {
        return $http({
          method: 'POST',
          url: '/api/collection/removeFilmFromCollection',
          data: postData,
          headers: { 'Content-Type': 'application/json' }
        });
      };
      return collection;
    };
    api.festivals = function () {
      var festivals = {};
      
      festivals.films = function () {
        var films = {};
        
        films.invite = function () {
          var invite = {};
          invite.createNewInvite = function (inviteFilmMakerData) {
            return $http({
              method: 'POST',
              url: '/api/invite/create',
              data: inviteFilmMakerData,
              headers: { 'Content-Type': 'application/json' }
            });
          };

          invite.getInvitedFilmmakers = function (festivalId) {
            return $http({
              method: 'GET',
              url: '/api/invite/?festivalId=' + festivalId,
              headers: { 'Content-Type': 'application/json' }
            });
          };
          invite.reInviteFilmmaker = function (inviteFilmMaker) {
            return $http({
              method: 'POST',
              url: '/api/invite/reinvite',
              data: inviteFilmMaker,
              headers: { 'Content-Type': 'application/json' }
            });
          };

          invite.inviteAllFilmmaker = function (filmmakers) {
            return $http({
              method: 'POST',
              url: '/api/invite/invite',
              data: filmmakers,
              headers: { 'Content-Type': 'application/json' }
            });
          };
          invite.checkFilmmakerUniqueCode = function (filmmakerUniqueCode) {
            return $http({
              method: 'GET',
              url: '/api/invite/check?filmmakerUniqueCode=' + filmmakerUniqueCode,
              headers: { 'Content-Type': 'application/json' }
            });
          };
          invite.deleteSentInvite = function (filmmaker) {
            return $http({
              method: 'DELETE',
              url: '/api/invite/delete',
              data: filmmaker,
              headers: { 'Content-Type': 'application/json' }
            });
          };
          return invite;
        };
        return films;
      };
      return festivals;
    };
    
    api.setup();
    return api;
  }

  ffmediaApi.$inject = [
    '$http',
  ];
}(window.jQuery || window.$, window.angular));
