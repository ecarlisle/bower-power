// Install the Bower module.
var bower = require('bower'),
  exec = require('child_process').exec;

// All Bower API functionaly comes from 'bower.commands'
bower.commands
  .install(['jquery', 'bootstrap', 'mustache', 'backbone', 'font-awesome', 'modernizr'], {
    save: true
  })
  .on('end', function(installed) {
    exec('tree bower_components -d -L 1 -C', function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
  });