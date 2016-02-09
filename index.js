/* globals module */
/* jshint node: true */

'use strict';

var flatiron = require('broccoli-flatiron');
var fs = require('fs');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');

module.exports = {
  name: 'ember-cli-press',

  included: function (app) {
    this._super.included(app);
  },

  treeForAddon: function (tree) {
    var mdPaths = [],
        mdFilesPath = '_markdown';

    if (this.project.name() !== 'ember-cli-press') {
      var appMdRoot = path.join(this.project.root, 'app', mdFilesPath);
      if (fs.existsSync(appMdRoot)) {
        mdPaths.push(appMdRoot);
      }
    }

    var dummyMdRoot = path.join(this.project.root, 'tests', 'dummy', 'app', mdFilesPath);
    if (fs.existsSync(dummyMdRoot)) {
      mdPaths.push(dummyMdRoot);
    }

    if (mdPaths.length > 0) {
      var mdFunnel = new Funnel(mergeTrees(mdPaths), {
        include: [new RegExp(/\.md/)]
      });

      var mdFlattened = flatiron(mdFunnel, {
        outputFile: 'markdownFiles.js',
        trimExtensions: true
      });

      tree = mergeTrees([tree, mdFlattened]);
    }

    return this._super.treeForAddon.call(this, tree);
  }
};
