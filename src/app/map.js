import moment from 'moment';
import axios from 'axios';
import geojson from 'geojson';

const googleSheetUrl = 'https://spreadsheets.google.com/feeds/list/1nABudmgmscjQmmZZZUUCbyC8n4HHPeEVyg-KWw6LyKQ/1/public/values?alt=json';

const getLocation = (date, cities) => {
  let result = {};
  if (date && cities) {
    for (let i = 0; i < cities.length; i += 1) {
      if (moment(date, 'DD/MM/YYYY').diff(moment(cities[i].properties.to, 'DD/MM/YYYY')) >= 0) {
        result = cities[i];
      } else {
        break;
      }
    }
  }
  return result;
};

const getCities = async () => {
  const result = await axios.get(googleSheetUrl);
  const cities = result.data.feed.entry.map(city => ({
    lat: city.gsx$lat.$t.replace(/,/g, '.'),
    lng: city.gsx$lng.$t.replace(/,/g, '.'),
    to: city.gsx$to.$t,
    name: city.gsx$city.$t,
    icon: 'circle',
    description: `<h2>${city.gsx$city.$t}</h2><p>${city.gsx$to.$t}</p>`,
  }));
  return cities;
};

const getRoutes = async () => {
  const result = await axios.get(googleSheetUrl);
  const routes = result.data.feed.entry.map(city => ({
    route: JSON.parse(`[${city.gsx$route.$t}]`),
  }));
  return routes;
};

const toGeoJson = (elt) => {
  const geoJsonElt = geojson.parse(elt, {
    Point: ['lat', 'lng'],
    LineString: 'route',
  });
  return geoJsonElt;
};

export default {
  getLocation,
  getCities,
  getRoutes,
  googleSheetUrl,
  toGeoJson,
};
