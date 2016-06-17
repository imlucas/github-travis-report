var reposForOrg = require('mongodb-repo-list');
var GitHubApi = require("github");
var YAML = require('yamljs');
var token = process.argv[2];
var through = require('through2').obj

var data = [];



var travisReport = function(options, done) {
  var github = new GitHubApi({
    debug: false,
    protocol: "https",
    host: "api.github.com", 
    pathPrefix: null,
    timeout: 5000,
    followRedirects: false   
  });

  github.authenticate({
    type: "oauth",
    token: token
  })

  function write(buf, enc, next){
    github.repos.getContent({
      user: 'mongodb-js',
      repo: buf.name,
      path: '.travis.yml'
    }, function(err, response) {
      if (err) {
        console.error(err.message);
        next(null, 'err');
      }
      else{
        var decoded = new Buffer( response.content.toString(), 'base64' );
        var yam = YAML.parse(decoded.toString());
        var json = JSON.parse(JSON.stringify(yam));
        next(err, { name: buf.name, nodeVersion: json.node_js});
      }
    });
  }

  function end(ended) {
    ended();
  }

  reposForOrg({'org' : 'mongodb-js', 'token' : token}, function(err, res) {
    if (err) {
      console.error(err.message);
    }
    else{
      done(res.pipe(through(write, end)).on('error', function(e){console.error(e)}));
    }
  });
}

module.exports = travisReport;


