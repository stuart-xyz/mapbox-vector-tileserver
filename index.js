var mapnik = require('mapnik');
var fs = require('fs');
var express = require('express');
var zlib = require('zlib');
var Promise = require('promise');
var SphericalMercator = require('sphericalmercator');

var mercator = new SphericalMercator({
  size: 256 // tile size
});

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

var app = express();
app.get('/map/:layerName/:z/:x/:y.pbf', (req, res) => {
    var opts = {
        x: parseInt(req.params.x),
        y: parseInt(req.params.y),
        z: parseInt(req.params.z),
        layerName: req.params.layerName
    };
    makeVectorTile(opts).then((vectorTile) => {
        zlib.deflate(vectorTile, (err, data) => {
            if (err) return res.status(500).send(err.message);
            res.setHeader('Content-Encoding', 'deflate');
            res.setHeader('Content-Type', 'application/x-protobuf');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(data);
        });
    });
});

app.listen(8080, (err) => {
  if (err) { 
    console.log(err);
  } else {
    console.log("Listening on port 8080...");
  }
});

function makeVectorTile(opts) {
  var extent = mercator.bbox(opts.x, opts.y, opts.z, false, '3857');
  var map = new mapnik.Map(256, 256, '+init=epsg:3857');
  map.loadSync('layers.xml');
  map.extent = extent;

  return new Promise((resolve, reject) => {
      var vectorTile = new mapnik.VectorTile(parseInt(opts.z), parseInt(opts.x), parseInt(opts.y));
      map.render(vectorTile, function (err, vtile) {
          if (err) return reject(err);
          resolve(vectorTile.getData());
      });
  });
}
