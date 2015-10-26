// Install the Bower module.
var bower = require('bower');

// All Bower API functionaly comes from 'bower commands'
bower.commands
.install(['jquery','bootstrap','mustache','backbone','font-awesome','modernizr'], { save: true })
.on('end', function (installed) {
    console.log(installed);
});

