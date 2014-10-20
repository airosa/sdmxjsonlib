sdmxjsonlib
===========

Experimental SDMX-JSON client library

Library contains two parts: request and response. Request contains functions
for building a SDMX RESTful API data request. Response contains functions that
map SDMX-JSON responses to arrays and other data structures that are easy to process
with visualisation libraries like D3. It does not extend any core Javascript
objects.

## Usage ##

You can use [require.js](http://requirejs.org):

```javascript
var sdmxjsonlib = require('sdmxjsonlib');
```

or just include the library on a web page:

```
<script src="sdmxjsonlib.js"></script>
<script>console.log('sdmxjsonlib version: ' + sdmxjsonlib.version);</script>
```

## Request ##

Request are represented with a request.URL object. Request object contains
fields for all parameters in the SDMX RESTful API. Href method returns the
fully formatted url for the RESTful query.


```javascript
req = new sdmxjsonlib.request.URL();

req.hostname = 'a-sdw-wsrest.ecb.europa.eu';
req.path.pathname = 'service';
req.path.resource = 'data';
req.path.dataFlow.id = 'ICP';
req.path.key = [ 'M', [ 'EE', 'FI' ], 'N', '011000', '4', 'INX' ];
req.query.startPeriod = '2005';

d3.json(req.href()).header('Accept','application/json').get(handleResponse);
```

## Response ##

Response contains functions for mapping the SDMX-JSON responses for easier
visualisations. See the mapping sample for a live demo:

http://airosa.github.io/sdmxjsonlib/samples/mappings/

### mapComponentsForD3

Maps all the components in the response to an object. Property names are mapped
from the component id properties.

```javascript
var str = sdmxjsonlib.response.mapComponentsForD3(response);

console.log(str.freq.id);              // "FREQ"
console.log(str.freq.name);            // "Frequency"
console.log(str.freq.values[0].name ); // "Monthly"
console.log(str.freq._propertyName );  // "freq"
console.log(str.refArea.id);           // "REF_AREA"
```

### mapDataSetsForD3

Maps all observations in the response to an array:

```javascript
var data = sdmxjsonlib.response.mapDataSetsForD3(response);

console.log('Observation count ' + data.length);
console.log(data.[0]._key);                       // "M:U2:N:011000:4:INX:2014-01"
console.log(data.[0].obsValue);                   // 121.1
console.log(data.[0].freq.id);                    // "M"
console.log(data.[0].freq.name);                  // "Monthly"
console.log(data.[0].icpItem.name);               // "HICP - Food"
```

### mapDataSetsToJsonStat

Maps the response to [JSON-stat](http://json-stat.org) format:

```javascript
var data = sdmxjsonlib.response.mapDataSetsToJsonStat(response);

console.log(data.dataset_0.dimension.id[0]);                  // "FREQ"
console.log(data.dataset_0.dimension.FREQ.label);             // "Frequency"
console.log(data.dataset_0.dimension.FREQ.category.M.label);  // "Monthly"
console.log(data.dataset_0.value["0"]);                       // 121.1
```

