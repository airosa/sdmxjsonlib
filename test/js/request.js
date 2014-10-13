define(function (require) {
    var sdmxjsonlib = require('sdmxjsonlib');

    describe('request functions', function() {

        return it('supports data requests', function(done) {
            var req = new sdmxjsonlib.request.URL();
            req.should.have.property('protocol', 'https:');
            req.hostname = 'ws-endpoint';
            req.should.have.property('path');
            req.path.resource = 'data';
            req.path.dataFlow.agencyId = 'ECB';
            req.path.dataFlow.id = 'EXR';
            req.path.dataFlow.version = '2.0';
            req.path.key = ['M', 'FI', 'ONE', ['A', 'B']];
            req.path.dataProvider.agencyId = 'SDMX';
            req.path.dataProvider.id = 'ECB';

            req.href().should.equal('https://ws-endpoint/data/ECB,EXR,2.0/M.FI.ONE.A+B/SDMX,ECB');

            req.query.startPeriod = '2010';
            req.query.endPeriod = '2020';
            req.query.firstNObservations = '10';
            req.query.lastNObservations = '20';
            req.query.dimensionAtObservation = 'TIME_PERIOD';
            req.query.updatedAfter = '2010-12-31';
            req.query.detail = 'full';

            var queryParams = req.href().split('?')[1].split('&');

            [ 'startPeriod=2010',
              'endPeriod=2020',
              'firstNObservations=10',
              'lastNObservations=20',
              'dimensionAtObservation=TIME_PERIOD',
              'updatedAfter=2010-12-31',
              'detail=full'
            ].every(function(p) {
                return -1 < queryParams.indexOf(p);
            });

            return done();
        });
    });

});
