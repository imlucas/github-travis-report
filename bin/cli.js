#!/usr/bin/env node

/* eslint no-console:0 */

var travisReport = require('../lib/index.js');
var yargs = require('yargs');
var yaml = require('js-yaml');
var EJSON = require('mongodb-extended-json');
var fs = require('fs');

var options = yargs.usage('Usage: $0 <organization> --token <oauth token> --feature <feature> [options]')
  .required(1, '*Organization is required*')
  .option('token', {
    alias: 't',
    describe: 'github oauth access token'
  })
  .require('token')
  .option('feature', {
    describe: 'feature to report on'
  })
  .require('token')
  .require('feature')
  .option('forked', {
    describe: 'include forked directories'
  })
  .option('out', {
    alias: 'o',
    describe: 'write to file instead of stdout',
    default: null
  })
  .option('format', {
    describe: 'choose format',
    default: 'json'
  })
  .option('grep', {
    alias: 'g',
    describe: 'find repos of a certain pattern'
  })
  .choices('format', ['json', 'yaml'])
  .choices('keys', ['name', 'html_url'])
  .default('forked', false)
  .help('help')
  .alias('help', 'h')
  .argv;

var argv = yargs.argv;

var report = travisReport({
  org: options._[0],
  keys: ['name'],
  token: argv.token,
  feature: argv.feature
});

var data = [];

function writeData() {
  var output = '';
  if (argv.format === 'yaml') {
    output = yaml.dump(data);
  } else {
    output = EJSON.stringify(data, null, 2);
  }

  if (argv.out) {
    var dest = fs.createWriteStream(argv.out);
    dest.write(output);
    dest.end();
  } else {
    console.log(output);
  }
}

report.on('data', function(chunk) {
  data.push(chunk);
});

report.on('error', function(err) {
  console.error(err.message);
});

report.on('end', function() {
  writeData();
});
