const assume = require('assume');
const { describe, it } = require('mocha');
const { getChonkiness } = require('../../index');

describe('getChonkiness', function () {
  global.argv = {
    lawd: 50000,
    mega: 10000,
    hefty: 2000,
    heck: 500,
    chonk: 50
  };

  it('is a function', function () {
    assume(getChonkiness).is.a('function');
    assume(getChonkiness).has.length(1);
  });

  function assumeSizeResponse(size, expectedResponse) {
    return function _assumeSizeResponse() {
      const res = getChonkiness(size);
      assume(res.text).equals(expectedResponse);
    };
  }

  it('correctly identifies a fine file', assumeSizeResponse(5000, 'A fine file'));
  it('correctly identifies a chonker', assumeSizeResponse(50001, 'It chonk'));
  it('correctly identifies a a heckin\' chonker', assumeSizeResponse(500001, 'A heckin\' chonker'));
  it('correctly identifies a heftychonk', assumeSizeResponse(2000001, 'HEFTYCHONK'));
  it('correctly identifies a megachonker', assumeSizeResponse(10000001, 'MEGACHONKER'));
  it('correctly identifies when it comin\'', assumeSizeResponse(50000001, 'OH LAWD, IT COMIN\'!'));
});