module.exports = function(grunt) {
  grunt.initConfig({
    wiredep: {
      task: {
        src: [
          'index.html'
        ],
        options: {
          {'directory':'bower_components'},
          {'dependencies': true},
          {'devDependencies': false}
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-wiredep');
};