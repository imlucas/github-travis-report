var githubTravisReport = require('../');
var assert = require('assert');
var GitHubApi = require('github');
var sinon = require('sinon');

var report = require('../lib/index.js');

function isObject(obj) {
  return obj instanceof Object;
}

function hasProperties(obj) {
  return obj.hasOwnProperty('name')
    && obj.hasOwnProperty('version');
}

describe('github-travis-report', function() {
  before(function(done) {
    sinon.stub(GitHubApi.prototype, 'authenticate');
    done();
  });

  after(function(done) {
    GitHubApi.prototype.authenticate.restore();
    done();
  });

  it('should work', function() {
    assert(githubTravisReport);
  });
  it('should return a stream of objects', function() {
    var str = report({
      org: 'mongodb-js',
      feature: 'node_js'
    });
    var data = [];
    str.on('data', function(chunk) {
      data.push(chunk);
    });

    str.on('end', function() {
      assert.isTrue(data.every(isObject));
    });
  });
  it('objects have property name and version', function() {
    var str = report({
      org: 'mongodb-js',
      feature: 'node_js'
    });
    var data = [];
    str.on('data', function(chunk) {
      data.push(chunk);
    });

    str.on('end', function() {
      assert.isTrue(data.every(hasProperties));
    });
  });
});
