'use strict';

var path = require('path');
var https = require('https');
var mongoose = require('mongoose');
var Film = mongoose.model('Film');
var config = require(path.resolve('./config/config'));
var history = require('../films/history.server.controller');

// web methods
exports.createTeaser = createTeaser;
exports.getProgress = getProgress;


function createTeaser(req, res, next) {
  var videoS3url = req.body.videoS3url;
  var startClip = req.body.teaserStartTime || 0;
  var clipLength = req.body.teaserLength;
  if(!videoS3url) {
    res.json({ 'error': 'No source video url specified' });
    return;
  }
  var zencode_post_data = {
    "input": videoS3url,
    "outputs": [
      {
        "base_url": config.amazonS3.baseUrl + '/' + config.amazonS3.transcodingBucket,
        "start_clip": startClip,
        "clip_length": clipLength,
        "notifications": [
          {
            "url": "http://zencoderfetcher/"
          }
        ]
      }
    ]
  };
  var bodyString = JSON.stringify(zencode_post_data);
  console.log(bodyString);
  var zencode_post_options = get_zencoder_post_options(bodyString.length);
  var zencode_post_req = https.request(zencode_post_options, function(zen_res) {
    var totalData = '';
    zen_res.setEncoding('utf8');
    zen_res.on('error', function(err) {
      console.error(err);
    }).on('data', function(chunk) {
      if(chunk instanceof Buffer) {
        chunk = chunk.toString();
      }
      totalData += chunk;
    }).on('end', function() {
      console.log('Zencoder:createClip:data:'+totalData);
      try {
        var jsonData = JSON.parse(totalData);
        var teaserTranscodeID = jsonData.id; // Transcode job id
        var teaserS3url = jsonData.outputs[0].url; //S3 output url
        console.log('Transcoding teaser: '+teaserS3url+", transcode id: " + teaserTranscodeID);
        history.createTeaserHistory(teaserS3url, teaserTranscodeID);
        res.json({ 'teaserS3url': teaserS3url, 'teaserTranscodeID': teaserTranscodeID });
      } catch(err) {
        console.error('Failed to submit create teaser job: '+err);
        res.json({ 'error': err });
      }
    });
  });
  zencode_post_req.write(JSON.stringify(zencode_post_data));
  zencode_post_req.end();
}

function getProgress(req, res, next) {
  var jobId = req.query.jobid;
  var zencode_get_options = get_zencoder_progress_options(jobId);
  var zencode_get_req = https.request(zencode_get_options, function(zen_res) {
    zen_res.setEncoding('utf8');
    zen_res.on('error', function(err) {
      console.error(err);
    }).on('data', function(data) {
      var jsonData = JSON.parse(data);
      res.json(jsonData);
    });
  });
  zencode_get_req.write('');
  zencode_get_req.end();
}

function get_zencoder_progress_options(jobId) {
  var options = {
    host: 'app.zencoder.com',
    port: '443',
    path: '/api/v2/jobs/'+jobId+'/progress',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Zencoder-Api-Key': config.zencoder.clientSecret
    }
  };
  return options;
}

function get_zencoder_post_options(length) {
  var options = {
    host: 'app.zencoder.com',
    port: '443',
    path: '/api/v2/jobs',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': length,
      'Zencoder-Api-Key': config.zencoder.clientSecret
    }
  };
  return options;
}
