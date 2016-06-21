#!/usr/bin/env node

var travisReport = require('./lib/index.js');
var yargs = require('yargs');

var options = yargs.usage("Usage: $0 <organization> --token <oauth token> --feature <feature> [options]")
  .required( 1, "*Organization is required*")
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
  .choices('format', ['json', 'yaml', 'table'])
  .choices('keys', ['name', 'html_url'])
  .default('forked', false)
  .help('help')
  .alias('help', 'h')
  .argv

var argv = yargs.argv;

travisReport({
  org: options._[0], 
  keys: ['name', 'html_url'], 
  token: argv.token,
  feature: argv.feature
}, function(res) {
  res.on('data', function(chunk) {
    console.log(chunk);
  });
  res.on('end', function() {
    console.log('ended');
  });
});