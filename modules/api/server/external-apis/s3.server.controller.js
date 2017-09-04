'use strict';

var path = require('path');
var errorHandler = require('../errors.server.controller');
var https = require('https');
var config = require(path.resolve('./config/config'));
var fs = require('fs');

exports.upload = upload;
exports.deleteFromBucket = deleteFromBucket;

var S3FS = require('s3fs');
var mapS3FS = {
  'video': new S3FS(config.amazonS3.filmsBucket, {
    accessKeyId: config.amazonS3.accessKeyId,
    secretAccessKey: config.amazonS3.secretAccessKey
  }),
  'thumbnail': new S3FS(config.amazonS3.imagesBucket, {
    accessKeyId: config.amazonS3.accessKeyId,
    secretAccessKey: config.amazonS3.secretAccessKey
  }),
  'caption': new S3FS(config.amazonS3.captionsBucket, {
    accessKeyId: config.amazonS3.accessKeyId,
    secretAccessKey: config.amazonS3.secretAccessKey
  })
};
var mapS3Url = {
  'video': config.amazonS3.baseUrl + '/' + config.amazonS3.filmsBucket,
  'thumbnail': config.amazonS3.baseUrl + '/' + config.amazonS3.imagesBucket,
  'caption': config.amazonS3.baseUrl + '/' + config.amazonS3.captionsBucket
};

function upload(req, res, next) {
  var type = req.query.type;
  var file = req.files.file;
  var stream = fs.createReadStream(file.path);
  var ts = new Date().getTime();
  var newFilename = ts+'-'+file.originalFilename.replace(/\s/g, '_'); // no white spaces allowed in S3
  var fileUrl = mapS3Url[type]+'/'+ newFilename;
  mapS3FS[type].writeFile(newFilename, stream, function resolve(err) {
    if (err) {
      if (err.message) {
        err = err.message;
      } else {
        err = errorHandler.getErrorMessage(err);
      }
      res.status(400).send({
        message: err
      });
    } else {
      fs.unlink(file.path, function resolve(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          if (fileUrl) {
            res.json({ url: fileUrl });
          }
        }
      });
    }
  });
}
function deleteFromBucket(fileNameArray) {
  var deleteImage_req = https.request(deleteImage('authorizationString', fileNameArray[fileNameArray.length - 1], config.amazonS3.imagesBucket), function (deleteImage_res) {
    deleteImage_res.on('data', function (data) {});
  });
  deleteImage_req.write('');
  deleteImage_req.end();
}
function deleteImage(authorizationString, fileName, bucket) {
  var options = {
    host: bucket + '.s3.amazonaws.com',
    path: '/' + fileName,
    method: 'DELETE',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': authorizationString
    }
  };
  return options;
}
