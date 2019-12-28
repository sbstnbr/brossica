
import fs from 'fs';
import geojson from 'geojson';
import { getData, writeFile, getRoutes } from './map';
import { updatePostList } from './instagram';

import existingPosts from '../data/posts.json';

const googleSheetUrl = 'https://spreadsheets.google.com/feeds/list/1nABudmgmscjQmmZZZUUCbyC8n4HHPeEVyg-KWw6LyKQ/1/public/values?alt=json';
const instagramURL = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=6756377666.0bf922c.05fc969e40cb4233993910dd6f12ed63';

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

getData(instagramURL)
  .then((response) => {
    console.log(`Existing posts: ${existingPosts.length} / Updated posts: ${response.data.data.length}`);
    return response.data.data;
  })
  .then(data => updatePostList(existingPosts, data))
  .then((posts) => {
    fs.writeFile(`${__dirname}/../data/posts.json`, JSON.stringify(posts), (err) => {
      if (err) throw err;
      console.log('Posts saved');
    });
    return posts;
  })
  .then((posts) => {
    const parsedPosts = posts.map(post => ({
      lat: post.location.latitude,
      lng: post.location.longitude,
      icon: 'attraction',
      description: `<a href="${post.link}" target="_blank"><img style="height:300px;width:300px" src=${post.images.standard_resolution.url}></a>`,
    }));
    const geoJsonPosts = geojson.parse(parsedPosts, { Point: ['lat', 'lng'] });
    writeFile(`${__dirname}/../data/geoJsonPosts.json`, JSON.stringify(geoJsonPosts), 'GeoJson Posts saved!');
  })
  .catch(err => console.error(err));
