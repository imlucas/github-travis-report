/* eslint callback-return:0 */

var reposForOrg = require('mongodb-js-repo-list');
var GitHubApi = require('github');
var YAML = require('yamljs');
var es = require('event-stream');

module.exports = function(options) {
  var stream = reposForOrg(options);
  var github = new GitHubApi({
    debug: false,
    protocol: 'https',
    host: 'api.github.com',
    pathPrefix: null,
    timeout: 5000,
    followRedirects: false
  });

  github.authenticate({
    type: 'oauth',
    token: options.token
  });

  return stream.pipe(es.map(function(data, callback) {
    github.repos.getContent({
      user: options.org,
      repo: data.name,
      path: '.travis.yml'
    }, function(err, response) {
      if (err) {
        callback();
      } else {
        var decoded = new Buffer( response.content.toString(), 'base64' );
        var yam = YAML.parse(decoded.toString());
        var json = JSON.parse(JSON.stringify(yam));
        return callback(null, { name: data.name,
                    version: json[options.feature].join(', ')});
      }
    });
  }));
};
