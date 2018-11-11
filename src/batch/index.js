import { getData, writeFile, getRoutes } from './map';

const geojson = require('geojson');
const fs = require('fs');

const googleSheetUrl = 'https://spreadsheets.google.com/feeds/list/1nABudmgmscjQmmZZZUUCbyC8n4HHPeEVyg-KWw6LyKQ/1/public/values?alt=json';

getData(googleSheetUrl)
  .then((response) => {
    writeFile(`${__dirname}/../data/data.json`, JSON.stringify(response.data.feed.entry), 'Data saved!');
    return response.data.feed.entry;
  })
  .then((cities) => {
    const parsedCities = cities.map(city => ({
      lat: city.gsx$lat.$t.replace(/,/g, '.'),
      lng: city.gsx$lng.$t.replace(/,/g, '.'),
      to: city.gsx$to.$t,
      name: city.gsx$city.$t,
      icon: 'circle',
      description: `<h2>${city.gsx$city.$t}</h2><p>${city.gsx$to.$t}</p>`,
    }));
    const geoJsonCities = geojson.parse(parsedCities, { Point: ['lat', 'lng'] });
    writeFile(`${__dirname}/../data/cities.json`, JSON.stringify(geoJsonCities), 'Cities saved!');
    return cities;
  })
  .then(cities => getRoutes(cities))
  .then(routesResult => fs.writeFile(`${__dirname}/../data/routes.json`,
    JSON.stringify(routesResult), (err) => {
      if (err) throw err;
      console.log('Routes saved!');
    }))
  .catch(err => console.log('ERROR', err));
