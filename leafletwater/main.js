import './style.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css';


import L from 'leaflet'

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import geoblaze from 'geoblaze';

let provider = new OpenStreetMapProvider();





const map = L.map('map', {
  center: [35.50, -90],
  zoom: 5
});

var southWest = L.latLng(0, -180),
  northEast = L.latLng(90, -60.885444);
var bounds = L.latLngBounds(southWest, northEast);





function getColor(d) {
  return d > 200 ? '#b10026' :
    d > 100 ? '#e31a1c' :
      d > 50 ? '#fc4e2a' :
        d > 40 ? '#fd8d3c' :
          d > 20 ? '#feb24c' :
            d > 10 ? '#ffeda0' :
              d > 5 ? '#ffffcc' :
              d > 0 ? '#f6ffcc':
                '#238b45';
}

// L.geoPackageFeatureLayer([], {
//   geoPackageUrl: 'https://temmdata.s3.us-east-005.backblazeb2.com/violations.gpkg',
//   layerName: 'violations',
//   style: function(feature) {
//     return {
//       fillColor: getColor(feature.properties.violations),
//       weight: 0.2,
//       opacity: 1,
//       color: 'white',
//       dashArray: '3',
//       fillOpacity: 0.7
//     };
//   },

// }).addTo(map);

var url_to_geotiff_file = 'https://temmdata.s3.us-east-005.backblazeb2.com/cogviolations.tif';

fetch(url_to_geotiff_file)
.then(response => response.arrayBuffer())
.then(arrayBuffer => {
  parseGeoraster(arrayBuffer).then(georaster => {

    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
      ext: 'png',
      minNativeZoom: 4,
      minZoom: 4,
      maxNativeZoom: 11,
      maxZoom: 11,
      tms: false,
      bounds: bounds
    }).addTo(map);
    // available color scales can be found by running console.log(chroma.brewer);

    var layer = new GeoRasterLayer({
        georaster: georaster,
        opacity: 0.7,
        pixelValuesToColorFn: function(pixelValues) {
          var pixelValue = pixelValues[0]; // there's just one band in this raster
          // if there's zero wind, don't return a color
          if (pixelValue < 0) return null;
          

          // scale to 0 - 1 used by chroma
          //var scaledPixelValue = (pixelValue - min) / max;

          var color = getColor(pixelValue);

          return color;
        },
        resolution: 256,


        });
        function popupFormat(search) {
          var point = geoblaze.identify(georaster,[search.result.x, search.result.y]);
          if (point<0) {
            var featureInfo = 'No Data'
          } else {
            var featureInfo = point +' Violations';
          }
          
          return featureInfo;
        };
        const searchControl = new GeoSearchControl({
          provider: provider,
          autoComplete: true, // optional: true|false  - default true
          autoCompleteDelay: 250,
          style: 'bar',
          showPopup: true,           // optional: true|false  - default false
          popupFormat: popupFormat,   
    });
    layer.addTo(map);
    map.addControl(searchControl);
    ;
  });
});


