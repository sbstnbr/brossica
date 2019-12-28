const fs = require('fs');
const axios = require('axios');

const accessToken = 'pk.eyJ1Ijoic2JzdG5iciIsImEiOiJjamwybm0xOXYwMDcwM3Fwa3h0amZsZ2F3In0.dT34qctpNYbAjJCN5nrMsQ';

const boatRoutes = [{
  name: 'Spain-Ireland',
  start: [-3.8099803, 43.4623057],
  end: [-8.4863157, 51.8968917],
}, {
  name: 'UK-Belgium',
  start: [53.7456709, -0.3367413],
  end: [51.3189468, 3.2068507],
}];

async function getRoute(start, end) {
  if (boatRoutes.some(boatRoute => JSON.stringify(boatRoute.start) === JSON.stringify(start) && JSON.stringify(boatRoute.end) === JSON.stringify(end))) {
    console.log('Boat ride!');
    return {
      status: 200,
      data: {
        routes: [
          {
            geometry: {
              coordinates: [start, end],
              type: 'LineString',
            },
          },
        ],
        uuid: 'boat',
      },
    };
  }
  const directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`;
  return axios.get(directionsRequest);
}

async function getRoutes(itinerary) {
  const result = [];
  for (let index = 0; index < itinerary.length - 1; index++) {
    const start = JSON.parse(itinerary[index].gsx$coordinates.$t);
    const end = JSON.parse(itinerary[index + 1].gsx$coordinates.$t);
    if (start && end) {
      const response = await getRoute(start, end);
      if (response.status === 200) {
        result.push(response.data);
      }
    } else {
      console.log('Wrong data', itinerary[index]);
    }
  }
  return result;
}

async function getData(url) {
  return axios.get(url);
}

async function writeFile(path, data, message) {
  return fs.writeFile(path, data, (err) => {
    if (err) throw err;
    console.log(message);
  });
}

export {
  getRoutes,
  getRoute,
  getData,
  writeFile,
  boatRoutes,
};
