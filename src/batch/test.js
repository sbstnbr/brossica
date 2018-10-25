const dummyCities = require('../data/cities.json');
const geojson = require('geojson'); 

const cities = dummyCities.map(city => ({
  lat: city.gsx$lat.$t.replace(/,/g, '.'),
  lng: city.gsx$lng.$t.replace(/,/g, '.'),
  // to: city['gsx$date-end'].$t,
  name: city.gsx$city.$t,
}));

const geoJsonCities = geojson.parse(cities, {Point: ['lat', 'lng']});

console.log(JSON.stringify(geoJsonCities));