/* global describe, it, require */
'use strict';

var assert = require('assert');

describe('tdg5-bower generator', function () {

  it('can be imported without blowing up', function () {
    var app = require('../app');
    assert(app !== undefined);
  });

});
