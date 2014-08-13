'use strict';
/* global console, module, require */

var util = require('util');
var yeoman = require('yeoman-generator');
var _ = require('underscore.string');


function Tdg5BowerGenerator() {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    if (!this.options['skip-install']) { this.installDependencies(); }
  });

  this.pkg = require('../package.json');
}

util.inherits(Tdg5BowerGenerator, yeoman.generators.NamedBase);


Tdg5BowerGenerator.prototype.askFor = function askFor() {
  var done = this.async();
  var repoPathRegExp = /^https?:\/\/github\.com\/(.*?)(\.git)?$/;

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'rawName',
    message: "Please provide a name for your bower component:"
  },
  {
    name: 'description',
    message: 'Please provide a short description for your component:'
  },
  {
    name: 'repoUrl',
    message: 'Please provide a URL for the component git repository:'
  }];

  this.prompt(prompts, function (props) {
    this.rawName = props.rawName;
    this.slug = _.slugify(this.rawName);
    this.description = props.description;
    this.repoUrl = props.repoUrl;
    this.validVariableName = _.capitalize(_.slugify(this.rawName)).replace('-','');

    var repoPathMatches = this.repoUrl.match(repoPathRegExp);
    this.repoPath = repoPathMatches[1];

    done();
  }.bind(this));
};

Tdg5BowerGenerator.prototype.app = function app() {
  this.mkdir('src');

  this.componentName = _.slugify(this.rawName);

  this.template('_bower-component.js', 'src/' + this.componentName + '.js');
  this.template('_Gruntfile.js', 'Gruntfile.js');
  this.copy('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('_README.md', 'README.md');

  // Set up various karma test environments
  this.mkdir('config');
  this.mkdir('config/karma');
  this.copy('karma/build.conf.js', 'config/karma/build.conf.js');
  this.copy('karma/common.conf.js', 'config/karma/common.conf.js');
  this.copy('karma/min.conf.js', 'config/karma/min.conf.js');
  this.copy('karma/src.conf.js', 'config/karma/src.conf.js');

  // Add dummy test
  this.mkdir('test');
  this.template('_test.js', 'test/' + this.componentName + '_test.js');
};

Tdg5BowerGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('gitignore', '.gitignore');
  this.copy('files.js', 'files.js');
  this.copy('LICENSE', 'LICENSE');
  this.copy('travis.yml', '.travis.yml');
};

module.exports = Tdg5BowerGenerator;
