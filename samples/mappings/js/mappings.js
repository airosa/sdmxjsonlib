(function () {

  var input = document.getElementById('requestURL');
  var jsonOutput = document.getElementById('sdmxjson');
  var mappedOutput = document.getElementById('mappedJSON');
  var response;

//------------------------------------------------------------------------------

  (function () {
    var req = new sdmxjsonlib.request.URL();

    req.hostname = 'a-sdw-wsrest.ecb.europa.eu';
    req.path.pathname = 'service';

    req.path.resource = 'data';
    req.path.dataFlow.id = 'ICP';
    req.path.key = [ 'M', 'U2', 'N', '011000', '4', 'INX' ];
    req.query.startPeriod = '2014';
    req.query.dimensionAtObservation = 'AllDimensions';

    input.value = req.href();
  }).call(this);

//------------------------------------------------------------------------------

  var xhr = function (url) {
    var req = new XMLHttpRequest();

    var respond = function () {
        if (req.status !== 200) return console.warn(reg.status + ' ' + req.statusText);
        response = JSON.parse(req.responseText);
        jsonOutput.textContent = JSON.stringify(response, null, 2);
    };

    req.open('GET', url);
    req.setRequestHeader('Accept', 'application/json');

    req.onreadystatechange = function () {
      if (req.readyState > 3) respond();
    };

    req.onerror = function (err) {
      console.warn(err);
    };

    req.send(null);
  };

//------------------------------------------------------------------------------

  document.getElementById('request').onclick = function () {
    jsonOutput.textContent = '';
    mappedOutput.textContent = '';
    xhr(input.value);
  };

  document.getElementById('mapDataSetsToJsonStat').onclick = function () {
    var mapped = sdmxjsonlib.response.mapDataSetsToJsonStat(response);
    mappedOutput.textContent = JSON.stringify(mapped, null, 2);
  };

  document.getElementById('mapDataSetsForD3').onclick = function () {
    var mapped = sdmxjsonlib.response.mapDataSetsForD3(response);
    mappedOutput.textContent = JSON.stringify(mapped, null, 2);
  };

  document.getElementById('mapComponentsForD3').onclick = function () {
    var mapped = sdmxjsonlib.response.mapComponentsForD3(response);
    mappedOutput.textContent = JSON.stringify(mapped, null, 2);
  };

}).call(this);
