var path = require('path'),
  config = require(path.resolve('./config/config')),
  sg = require('sendgrid')(config.sendgrid.clientSecret),
  validator = require('validator'),
  swig = require('swig');

var templateDir = './modules/api/server/notifications/';
var wfTemplate = swig.compileFile(templateDir + 'welcome.filmmakers.html');
var waTemplate = swig.compileFile(templateDir + 'welcome.any.html');
var fromEmail = 'notifications@festv.us';

exports.welcomeFilmmaker = function(req, res) {
  if (req.user) {
    var toEmail = validator.escape(req.user.email);
    var html = wfTemplate();
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [{
          to: [{
            email: toEmail
          }],
          subject: 'Welcome Filmmaker!'
        }],
        from: {
          email: fromEmail
        },
        content: [{
          type: 'text/html', value: html
        }]
      }
    });
    sg.API(request, function (error, response) {
      if (error) {
        console.log(error);
        res.status(500).send(error);
      }
      res.status(response.statusCode).send(response.body);
    });
  } else {
    console.log('No user object passed!');
    res.status(422).send('Invalid request user object');
  }
};

exports.welcome = function(req, res) {
  if (req.user) {
    var toEmail = validator.escape(req.user.email);
    var toName = validator.escape(req.user.displayName);
    var html = waTemplate({
      name: toName
    });
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [{
          to: [{
            email: toEmail
          }],
          subject: 'Welcome ' + toName + '!'
        }],
        from: {
          email: fromEmail
        },
        content: [{
          type: 'text/html', value: html
        }]
      }
    });
    sg.API(request, function (error, response) {
      if (error) {
        console.log(error);
        res.status(500).send(error);
      }
      res.status(response.statusCode).send(response.body);
    });
  } else {
    console.log('No user object passed!');
    res.status(422).send('Invalid request user object');
  }
};
