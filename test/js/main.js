require.config({
    baseUrl: '/',
    paths: {
        'mocha'         : 'bower_components/mocha/mocha',
        'chai'          : 'bower_components/chai/chai',
        'chai-things'   : 'bower_components/chai-things/lib/chai-things',
        'sdmxjsonlib'   : 'sdmxjsonlib',
        'request'       : 'test/js/request',
        'map'           : 'test/js/map',
        'test-data'     : 'test/fixtures/test-data'
    },
    shim: {}
});

define(function (require) {
    var chai = require('chai');
    var chaiThings = require('chai-things');

    // Chai
    should = chai.should();
    chai.use(chaiThings);

    // Mocha
    require('mocha');
    mocha.setup('bdd');
    mocha.bail(false);

    require([
        'request',
        'map'
    ], function(require) {
        mocha.checkLeaks();
        mocha.run();
    });
});
