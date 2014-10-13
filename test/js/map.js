define(function (require) {
    var sdmxjsonlib = require('sdmxjsonlib');
    var testData = require('test-data');

    var KEY_SEPARATOR = ':';

    var readJsonFixture = function(filename, callback, done) {
        var onReadyStateChange = function() {
            if (request.readyState !== 4) {
                return;
            }
            return callback(JSON.parse(request.responseText), done);
        };

        var request = new XMLHttpRequest();
        request.open('GET', filename);
        request.onreadystatechange = onReadyStateChange;
        return request.send();
    };

    var isArrayIndex = function(num) {
        if (typeof num !== 'number') {
            return false;
        }

        if (num < 0) {
            return false;
        }

        return num % 1 === 0;
    };

    describe('mapDataSetsToArray function', function() {

        var mapTestFunction = function(key, seriesKey, value, dimIdxs, attrIdxs, dimensions, attributes) {
            dimIdxs.should.all.satisfy(function(num) {
                return isArrayIndex(num);
            });
            attrIdxs.should.all.satisfy(function(num) {
                if (num === null) return true;
                return isArrayIndex(num);
            });
            dimensions.should.be.an('array');
            dimensions.should.all.include.keys(['id', 'name', 'values']);
            attributes.should.be.an('array');
            attributes.should.all.include.keys(['id', 'name', 'values']);
            return [];
        };

        it('maps flat sdmx-json messages to arrays', function(done) {

            var callback = function(message) {
                var result = sdmxjsonlib.response.mapDataSetsToArray(message, true, mapTestFunction);
                result.should.be.an('array')["with"].length(4);
                return done();
            };

            return readJsonFixture('fixtures/exr-flat.json', callback);
        });

        it('maps groupped sdmx-json messages to arrays', function(done) {

            var callback = function(message) {
                var result = sdmxjsonlib.response.mapDataSetsToArray(message, true, mapTestFunction);
                result.should.be.an('array')["with"].length(4);
                return done();
            };

            return readJsonFixture('fixtures/exr-time-series.json', callback);
        });

        it('maps series keys in groupped sdmx-json messages to _seriesKey properties', function(done) {

            var callback = function(message) {
                var result = sdmxjsonlib.response.mapDataSetsToArray(message);
                result[0].should.have.property('_seriesKey').that.is.a('string')["with"].length.above(0);
                return done();
            };

            return readJsonFixture('fixtures/exr-time-series.json', callback);
        });

        it('maps groupped sdmx-json messages to arrays with objects', function(done) {
            var callback;

            callback = function(message) {
                sdmxjsonlib.response.updateComponents(message, sdmxjsonlib.response.addPropertyName);

                var result = sdmxjsonlib.response.mapDataSetsToArray(message, false, sdmxjsonlib.response.obsToStructureSpecific);
                result.should.be.an('array')["with"].length(4);

                var obs = result[0];
                obs.should.have.keys([
                    '_key',
                    '_seriesKey',
                    'obsValue',
                    'freq',
                    'currencyDenom',
                    'exrType',
                    'exrSuffix',
                    'currency',
                    'timePeriod',
                    'title',
                    'obsStatus',
                    'breaks'
                ]);

                var checkKeys = function(obs) {
                    var seriesKey = [
                        obs.freq.id,
                        obs.currency.id,
                        obs.currencyDenom.id,
                        obs.exrType.id,
                        obs.exrSuffix.id,
                        null
                    ].join(KEY_SEPARATOR);

                    obs._seriesKey.should.eql(seriesKey);
                    obs._key.should.eql(seriesKey + obs.timePeriod.id);
                };

                result.forEach(checkKeys);

                return done();
            };

            return readJsonFixture('fixtures/exr-time-series.json', callback);
        });

        return it('does not map series keys in flat sdmx-json messages', function(done) {
            var callback = function(message) {
                var result = sdmxjsonlib.response.mapDataSetsToArray(message);
                result[0].should.have.property('_seriesKey').that.is.a("null");
                return done();
            };

            return readJsonFixture('fixtures/exr-flat.json', callback);
        });

    });

    describe('obsToStructureSpecific function', function() {

        it('maps observations to objects', function() {
            var allDimensions = testData.dimensions.observation;
            var allAttributes = testData.attributes.observation;
            var result = sdmxjsonlib.response.obsToStructureSpecific(
                testData.observation._key,
                testData.observation._seriesKey,
                testData.observation.value,
                testData.observation.dimensions,
                testData.observation.attributes,
                allDimensions,
                allAttributes
            );

            result.should.contain.keys(['_key', '_seriesKey', 'obsValue']);
            result.should.have.property('obsDim0').eql({
                id: 'OBS_DIM0_ID0',
                name: 'obs dim0 name0'
            });
            result.should.have.property('obsDim1');
            result.should.have.property('obsAttr0').eql({
                id: 'OBS_ATTR0_ID0',
                name: 'obs attr0 name0'
            });

            return result.should.have.property('obsAttr1').eql({
                name: 'obs attr1 name1'
            });
        });

    });

    describe('mapComponentsToArray function', function() {

        it('maps dimensions and attributes to array', function(done) {
            var callback = function(message) {
                var result;
                result = sdmxjsonlib.response.mapComponentsToArray(message);
                result.should.be.an('array')["with"].length(9);
                return done();
            };

            return readJsonFixture('fixtures/exr-flat.json', callback);
        });

    });

    describe('mapComponentsToObject function', function() {

        it('maps dimensions and attributes to object', function(done) {
            var callback = function(message) {
                var result;
                sdmxjsonlib.response.prepare( message );
                result = sdmxjsonlib.response.mapComponentsToObject(message);
                Object.keys(result).should.be.an('array')["with"].length(9);
                return done();
            };

            return readJsonFixture('fixtures/exr-flat.json', callback);
        });

    });

    describe('mapDataSetsToJsonStat function', function() {
        var checkJsonStat, jsonStatCallback;

        checkJsonStat = function(jsonstat) {
            var dataSet = jsonstat.dataset_0;
            dataSet.should.be.an('object');

            dataSet.should.have.property('value').that.is.an('object');
            dataSet.value.should.have.keys(['0', '1', '2', '3']);
            dataSet.value['3'].should.equal(40.3);
            dataSet.should.have.property('dimension').that.is.an('object');
            dataSet.dimension.should.have.property('size').that.deep.equals([1, 1, 1, 1, 2, 2]);
            dataSet.dimension.CURRENCY.category.index.NZD.should.equal(0);
        };

        jsonStatCallback = function(message, done) {
            checkJsonStat(sdmxjsonlib.response.mapDataSetsToJsonStat(message));
            return done();
        };

        it('maps flat data sets to JSON-STAT format', function(done) {
            return readJsonFixture('fixtures/exr-flat.json', jsonStatCallback, done);
        });

        return it('maps groupped data sets to JSON-STAT format', function(done) {
            return readJsonFixture('fixtures/exr-time-series.json', jsonStatCallback, done);
        });

    });

    describe('mapDatasetsForD3 function', function() {

        var checkJsonStat, jsonStatCallback;

        checkD3Format = function(data) {
            data.should.be.an('array');

            data.forEach( function(o) {
                o.should.be.an('object');

                o.should.have.keys([
                    '_key',
                    '_seriesKey',
                    'obsValue',
                    'freq',
                    'currencyDenom',
                    'exrType',
                    'exrSuffix',
                    'currency',
                    'timePeriod',
                    'title',
                    'obsStatus',
                    'breaks'
                ]);

                o.timePeriod.should.be.an('object');
                o.timePeriod.should.have.keys(['name', 'id', 'start', 'end', '_startDate', '_endDate', '_index']);
                o.timePeriod.should.have.property('name').that.is.a('string');
                o.freq.should.be.an('object');
                o.freq.should.have.property('name').that.is.a('string');
                o.freq.should.have.keys(['id', 'name', '_index']);
                should.equal(o.breaks, undefined);
            });
        };

        d3Callback = function(message, done) {
            checkD3Format(sdmxjsonlib.response.mapDataSetsForD3(message));
            return done();
        };

        it('maps flat data sets for D3', function(done) {
            return readJsonFixture('fixtures/exr-flat.json', d3Callback, done);
        });

        it('maps groupped data sets for D3', function(done) {
            return readJsonFixture('fixtures/exr-time-series.json', d3Callback, done);
        });
    });


    describe('mapComponentsForD3 function', function() {

        it('maps dimensions and attributes to object', function(done) {
            var callback = function(message) {
                var result = sdmxjsonlib.response.mapComponentsForD3(message);

                result.should.be.an('object');
                result.should.have.keys([
                    'freq',
                    'currencyDenom',
                    'exrType',
                    'exrSuffix',
                    'currency',
                    'timePeriod',
                    'title',
                    'obsStatus',
                    'breaks'
                ]);
                result.freq.should.have.keys(['id', 'name', 'keyPosition', 'values', '_propertyName']);
                done();
            };

            return readJsonFixture('fixtures/exr-flat.json', callback);
        });

    });


});
