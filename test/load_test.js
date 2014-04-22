'use strict';
/* global describe, it, require */

var assert = require('assert');

describe('tdg5-bower generator', function() {

  it('can be imported without blowing up', function() {
    var app = require('../app');
    assert(app !== undefined);
  });

});
