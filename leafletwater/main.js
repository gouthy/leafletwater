import './style.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css';


import L from 'leaflet'

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';



let provider = new OpenStreetMapProvider();

const searchControl = new GeoSearchControl({
  provider: provider,
  autoComplete: true, // optional: true|false  - default true
  autoCompleteDelay: 250,
  style: 'bar',
  params: {
    countrycodes: 'us' // limit search results to Canada & United States
  }
});

const map = L.map('map', {
  center: [35.50, -90],
  zoom: 5
});
map.addControl(searchControl);

var southWest = L.latLng(30.396308, -180),
  northEast = L.latLng(70.384358, -60.885444);
var bounds = L.latLngBounds(southWest, northEast);

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  ext: 'png',
  minNativeZoom: 4,
  minZoom: 4,
  tms: false,
  bounds: bounds
}).addTo(map);

function getColor(d) {
  return d > 200 ? '#b10026' :
    d > 100 ? '#e31a1c' :
      d > 50 ? '#fc4e2a' :
        d > 40 ? '#fd8d3c' :
          d > 20 ? '#feb24c' :
            d > 10 ? '#ffeda0' :
              d > 5 ? '#ffffcc' :
                '#238b45';
}

L.geoPackageFeatureLayer([], {
  geoPackageUrl: 'https://temmdata.s3.us-east-005.backblazeb2.com/violations.gpkg',
  layerName: 'violations',
  style: function(feature) {
    return {
      fillColor: getColor(feature.properties.violations),
      weight: 0.2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  },

}).addTo(map);
