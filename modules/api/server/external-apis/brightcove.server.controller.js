'use strict';

var path = require('path');
var https = require('https');
var mongoose = require('mongoose');
var Film = mongoose.model('Film');
var config = require(path.resolve('./config/config'));
var history = require('../films/history.server.controller');
var TeaserIngestHistory = mongoose.model('TeaserIngestHistory');

// Brightcove account info:
var accountId = config.brightcove.accountId;
var authTokenBuffer = Buffer.from(config.brightcove.clientId+":"+config.brightcove.clientSecret, 'ascii');
var authTokenBase64 = authTokenBuffer.toString('base64');

// web methods:
exports.getAccountId = getAccountId;
exports.getVideoObject = getVideoObject;
exports.ingestVideo = ingestVideo;
exports.ingestTeaser = ingestTeaser;
// direct methods:
exports.getBrightcoveVideoObject = getBrightcoveVideoObject;


function getAccountId(req, res, next) {
  res.json({ 'accountId': accountId });
}

function getVideoObject(req, res, next) {
  getBrightcoveAuth(function(accessToken) {
    var videoId = req.query.videoid;
    var get_video_req = https.request(get_video_options(accessToken, videoId),
      function(video_res) {
        var totalData = '';
        video_res.setEncoding('utf8');
        video_res.on('data', function(data) {
          if(data instanceof Buffer) {
            data = data.toString();
          }
          totalData += data;
        });
        video_res.on('end', function() {
          var jsonData = JSON.parse(totalData);
          res.json(jsonData);
        });
      });
    get_video_req.end();
  });
}

function getBrightcoveVideoObject(videoId, callback) {
  getBrightcoveAuth(function(accessToken) {
    var get_video_req = https.request(get_video_options(accessToken, videoId),
      function(video_res) {
        var totalData = '';
        video_res.setEncoding('utf8');
        video_res.on('data', function(data) {
          if(data instanceof Buffer) {
            data = data.toString();
          }
          totalData += data;
        });
        video_res.on('end', function() {
          var jsonData = JSON.parse(totalData);
          if(callback) callback(jsonData);
        });
      });
    get_video_req.end();
  });
}

function ingestVideo(req, res, next) {
    var videoUrl = req.body.videoS3url;
    var title = req.body.title + ' : Video';
    var videoID = req.body.videoID;
    var videoIngested = req.body.videoIngested;
    if(videoID && videoIngested) {
      res.json({ 'videoID': videoID });
    } else if(videoID) { // re-ingest video
      getBrightcoveAuth(function(accessToken) {
        var ingest_video_req = https.request(get_ingest_video_options(videoID, accessToken), function (ingest_res) {
          ingest_res.on('data', function (data) {
            console.log('re-ingest video job started: ' + data);
          });
        });
        ingest_video_req.write(JSON.stringify(get_ingest_video_data(videoUrl)));
        ingest_video_req.end();
        history.createVideoHistory(videoUrl, videoID);
      });
      res.json({ 'videoID': videoID });
    } else { // new ingest video
      getBrightcoveAuth(function(accessToken) {
        var create_post_data = { "name": title };
        var create_post_req = https.request(get_create_post_options(accessToken), function(create_res) {
          create_res.on('data', function(data) {
            var jsonData = JSON.parse(data);
            videoID = jsonData.id;
            history.createVideoHistory(videoUrl, videoID);
            // Call Ingest Video API:
            console.log('Ingest Video with ID: '+videoID+' and Url: '+videoUrl);
            var ingest_video_options = get_ingest_video_options(videoID, accessToken);
            var ingest_video_req = https.request(ingest_video_options, function (ingest_res) {
              ingest_res.on('data', function (data) {
                console.log('Video ingest job started: ' + data);
              });
            });
            var ingest_video_data = get_ingest_video_data(videoUrl);
            ingest_video_req.write(JSON.stringify(ingest_video_data));
            ingest_video_req.end();
            res.json({ 'videoID': videoID });
          });
        });
        create_post_req.write(JSON.stringify(create_post_data));
        create_post_req.end();
      });
    }
}

function ingestTeaser(req, res, next) {
      var teaserUrl = req.body.teaserS3url;
      var title = req.body.title + ' : Teaser';
      TeaserIngestHistory.findOne({ teaserS3url: teaserUrl })
        .exec(function(err, teaserHistory) {
        if (err)
          console.error(err);
        if(teaserHistory) {
          console.log("Teaser url: "+teaserUrl+", history: "+teaserHistory);
          var teaserID = teaserHistory.teaserID;
          var teaserIngested = teaserHistory.teaserIngested;
          console.log('Ingest Teaser - ID: '+teaserID+', Url: '+teaserUrl+', Ingested: '+teaserIngested);
          if(!teaserUrl) {
            res.json({ 'error': 'No Teaser URL to ingest specified!' });
            return;
          }
          if(teaserID && teaserIngested) { // Already Ingested
            res.json({ 'teaserID': teaserID });
          } else if(teaserID) { // re-ingest teaser
            getBrightcoveAuth(function(accessToken) {
              var ingest_video_req = https.request(get_ingest_video_options(teaserID, accessToken), function (ingest_res) {
                ingest_res.on('data', function (data) {
                  console.log('re-ingest video job started: ' + data);
                });
              });
              ingest_video_req.write(JSON.stringify(get_ingest_video_data(teaserUrl)));
              ingest_video_req.end();
            });
            res.json({ 'teaserID': teaserID });
          } else if(teaserUrl) { // new ingest teaser
            getBrightcoveAuth(function (accessToken) {
              var create_post_data = { "name": title };
              var create_post_req = https.request(get_create_post_options(accessToken), function (create_res) {
                create_res.on('data', function (data) {
                  var jsonData = JSON.parse(data);
                  teaserID = jsonData.id;
                  teaserHistory.teaserID = teaserID;
                  teaserHistory.save();
                  var ingest_video_options = get_ingest_video_options(teaserID, accessToken);
                  var ingest_video_req = https.request(ingest_video_options, function (ingest_res) {
                    ingest_res.on('data', function (data) {
                      console.log('Video ingest job started: ' + data);
                    });
                  });
                  var ingest_video_data = get_ingest_video_data(teaserUrl);
                  ingest_video_req.write(JSON.stringify(ingest_video_data));
                  ingest_video_req.end();
                  res.json({ 'teaserID': teaserID });
                });
              });
              create_post_req.write(JSON.stringify(create_post_data));
              create_post_req.end();
            });
          }
        } else { // This should never happen:
          console.error('Teaser history not found!');
          res.json({ 'error': 'No history record of this teaser url exists.' });
        }
      });
}

function getBrightcoveAuth(callback) {
  var oauth_post_req = https.request(get_oauth_post_options(), function(oauth_res) {
    oauth_res.setEncoding('utf8');
    oauth_res.on('data', function (token) {
      var jsonToken = JSON.parse(token);
      var accessToken = jsonToken.access_token;
      callback(accessToken);
    });
  });
  oauth_post_req.write('grant_type=client_credentials');
  oauth_post_req.end();
}

function logError(err) {
  if (err) console.error(err);
}

function get_ingest_video_data(url) {
  var descriptor = {
    "master": {
      "url": url
    },
    "profile": "high-resolution"
  };
  return descriptor;
}

function get_oauth_post_options() {
  var options = {
    host: 'oauth.brightcove.com',
    port: '443',
    path: '/v3/access_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + authTokenBase64
    }
  };
  return options;
}

function get_video_options(accessToken, videoId) {
  var options = {
    host: 'cms.api.brightcove.com',
    port: '443',
    path: '/v1/accounts/'+accountId+'/videos/'+videoId,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  };
  return options;
}

function get_create_post_options(accessToken) {
  var options = {
    host: 'cms.api.brightcove.com',
    port: '443',
    path: '/v1/accounts/'+accountId+'/videos',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  };
  return options;
}

function get_ingest_video_options(videoId, accessToken) {
  var options = {
    host: 'ingest.api.brightcove.com',
    port: '443',
    path: '/v1/accounts/' + accountId + '/videos/' + videoId + '/ingest-requests',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  };
  return options;
}
