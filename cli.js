#!/usr/bin/env node

var travisReport = require('./lib/index.js')

travisReport({}, function(res) {
  res.on('data', function(chunk) {
    console.log(chunk);
  });
  res.on('end', function() {
    console.log('ended');
  });
});