const fs = require('fs');
const axios = require('axios');
const geojson = require('geojson'); 

const accessToken = 'pk.eyJ1Ijoic2JzdG5iciIsImEiOiJjamwybm0xOXYwMDcwM3Fwa3h0amZsZ2F3In0.dT34qctpNYbAjJCN5nrMsQ';

const boatRoute = {
  start: [-3.8099803,43.4623057],
  end: [-8.4863157,51.8968917]
};

const googleSheetUrl = 'https://spreadsheets.google.com/feeds/list/1nABudmgmscjQmmZZZUUCbyC8n4HHPeEVyg-KWw6LyKQ/1/public/values?alt=json';

getData(googleSheetUrl)
  .then(response => {
    writeFile(__dirname+'/../data/data.json',JSON.stringify(response.data.feed.entry),'Data saved!')
    return response.data.feed.entry;
  })
  .then(cities => {
    const parsedCities = cities.map(city => ({
      lat: city.gsx$lat.$t.replace(/,/g, '.'),
      lng: city.gsx$lng.$t.replace(/,/g, '.'),
      to: city.gsx$to.$t,
      name: city.gsx$city.$t,
      icon: 'circle',
      description: '<h2>'+city.gsx$city.$t+'</h2><p>'+city.gsx$to.$t+'</p>'
    }));
    const geoJsonCities = geojson.parse(parsedCities, {Point: ['lat', 'lng']});
    writeFile(__dirname+'/../data/cities.json',JSON.stringify(geoJsonCities),'Cities saved!')
    return cities;
  })
  // .then(cities => getRoutes(cities))
  // .then(routesResult => fs.writeFile(__dirname+'/../data/routes.json', JSON.stringify(routesResult), (err) => {  
  //   if (err) throw err;
  //   console.log('Routes saved!');
  // }))
  .catch(err => console.log('ERROR',err))



async function getRoutes(itinerary){
  const result = [];
  for (let index = 0; index < itinerary.length-1; index++) {
    const start = JSON.parse(itinerary[index].gsx$coordinates.$t);
    const end = JSON.parse(itinerary[index+1].gsx$coordinates.$t);
    if (start && end){
      const response = await getRoute(start,end);
      if(response.status === 200){
        result.push(response.data)
      }
    } else {
      console.log('Wrong data', itinerary[index]);
    }
    
  }
  return result;
}

async function getRoute(start,end) {
  if(JSON.stringify(start) === JSON.stringify(boatRoute.start) && JSON.stringify(end) === JSON.stringify(boatRoute.end)){
    console.log('Boat ride!');
    return {
      "status": 200,
      "data": {
        "routes": [
          {
            "geometry": {
              "coordinates": [start,end],
              "type": "LineString"
            }
          }
        ],
        "uuid": "boat"
      }
    }
  }
  const directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + accessToken;
  return axios.get(directionsRequest); 
}

async function getData(url){
  return axios.get(url);
}

async function writeFile(path,data,message){
  return fs.writeFile(path, data, (err) => {  
    if (err) throw err;
    console.log(message);
  })
}