const fs = require('fs');
const axios = require('axios');

const accessToken = 'pk.eyJ1Ijoic2JzdG5iciIsImEiOiJjamwybm0xOXYwMDcwM3Fwa3h0amZsZ2F3In0.dT34qctpNYbAjJCN5nrMsQ';

const boatRoute = {
  start: [-3.8099803,43.4623057],
  end: [-8.4863157,51.8968917]
};

const itinerary = [
  [2.2431251,48.9237226],[-1.7833,46.5],[0.54338,45.04037],[1.444209,43.604652],[2.8291066,42.3531541],[3.1857816,41.8923794],[2.7471811,41.9076455],[2.1734035,41.3850639],[0.9236691,40.9908991],[0.1050557,38.8387992],[-0.8379313,37.8054749],[-0.7200237,37.6311518],[-2.9048012,37.333506],[-4.4213988,36.7212737],[-6.2885962,36.5270612],[-5.9844589,37.3890924],[-6.9447224,37.261421],[-7.6430019,37.1335906],[-7.9304397,37.0193548],[-8.4677851,37.1068147],[-8.9405858,37.0168316],[-8.6730275,37.1027881],[-8.8941,38.5254047],[-9.1393366,38.7222524],[-8.6291053,41.1579438],[-3.1568245,43.2742682],[-3.8099803,43.4623057],[-8.4863157,51.8968917],[-8.5222327,51.7058853],[-9.8188888,51.4522222],[-10.1983505,51.5967169],[-9.42651,52.97188],[-10.0202388,53.4891345],[-8.4666667,54.45],[-7.6350788,55.2056262],[-6.5115554,55.2408073],[-5.93012,54.597285],[-5.0268868,54.976479],[-4.251806,55.864237],[-5.4736237,55.803296],[-6.177067,55.7362535],[-5.4736237,55.803296],[-6.2262725,57.5359261],[-4.224721,57.477773],[-2.094278,57.149717],[-2.970721,56.462018],[-3.188267,55.953252],[-2.2426305,53.4807593],[-1.61778,54.978252],[4.8951679,52.3702157],[8.6821267,50.1109221],[13.404954,52.5200066],[9.9936819,53.5510846],[8.0471788,52.2799112],[8.8016936,53.0792962],[9.9936819,53.5510846],[13.0644729,52.3905689],[13.404954,52.5200066],[12.0991466,54.0924406],[12.5683372,55.6760968],[13.003822,55.604981],[11.97456,57.70887],[10.7522454,59.9138688],[5.3220544,60.3912628],[10.3950528,63.4305149],[14.404916,67.2803556],[13.6397069,67.9931452],[15.3275932,68.0167764],[25.7836599,71.1709533],[25.7293906,66.5039478],[24.9383791,60.1698557],[24.7535747,59.4369608],[24.1051865,56.9496487],[25.2796514,54.6871555],[21.0122287,52.2296756],[19.040235,47.497912],[24.7963878,46.2197025],[26.1025384,44.4267674],[28.9783589,41.0082376],[22.3585552,40.0884128],[21.6305896,39.7217044],[19.8186982,41.3275459],[18.771234,42.424662],[18.0944238,42.6506606],[16.4401935,43.5081323],[13.7301877,45.548059],[12.3155151,45.4408474],[13.518915,43.6158299],[16.8718715,41.1171432],[14.4989344,40.7461572],[9.0851765,45.8080597],[11.8440351,46.4102117],[11.5819805,48.1351253],[2.2431251,48.9237226]
];

const googleSheetUrl = 'https://spreadsheets.google.com/feeds/list/1nABudmgmscjQmmZZZUUCbyC8n4HHPeEVyg-KWw6LyKQ/1/public/values?alt=json';

getData(googleSheetUrl)
  .then(response => {
    fs.writeFile(__dirname+'/../data/cities.json', JSON.stringify(response.data.feed.entry), (err) => {  
      if (err) throw err;
      console.log('Cities saved!');
    })
    return response.data.feed.entry;
  })
  .then(cities => getRoutes(cities))
  .then(routesResult => fs.writeFile(__dirname+'/routes.json', JSON.stringify(routesResult), (err) => {  
    if (err) throw err;
    console.log('Routes saved!');
  }))
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