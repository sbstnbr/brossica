import mapboxgl from 'mapbox-gl';
import moment from 'moment';
// import routes from '../data/routes.json';
import posts from '../data/geoJsonPosts.json';
// import cities from '../data/cities.json';
import mapUtils from './map';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2JzdG5iciIsImEiOiJjamwybm0xOXYwMDcwM3Fwa3h0amZsZ2F3In0.dT34qctpNYbAjJCN5nrMsQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [12.35, 57.82],
  zoom: 2.35,
  minZoom: 2.35,
  maxZoom: 6,
});

// When a click event occurs on a feature in the cities layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'cities', (e) => {
  const coordinates = e.features[0].geometry.coordinates.slice();
  const description = e.features[0].properties.description;
  console.log('CITY', description);
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup({ className: 'popup' })
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});

// When a click event occurs on a feature in the posts layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'posts', (e) => {
  const coordinates = e.features[0].geometry.coordinates.slice();
  const description = e.features[0].properties.description;

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup({ className: 'popup' })
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});


// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'places', () => {
  map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'places', () => {
  map.getCanvas().style.cursor = '';
});


function loadItinerary(map, routes) {
  routes.forEach((route) => {
    map.addLayer({
      id: `route${route.uuid}`,
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: route.routes[0].geometry,
        },
      },
      paint: {
        'line-width': 2,
      },
    });
  });
}

function loadGeoJsonSymbol(map, name, data) {
  console.log(name, data);
  map.addLayer({
    id: name,
    type: 'symbol',
    source: {
      type: 'geojson',
      data,
    },
    layout: {
      'icon-image': '{icon}-11',
    },
  });
}

function loadGeoJsonLine(map, name, data) {
  map.addLayer({
    id: name,
    type: 'line',
    source: {
      type: 'geojson',
      data,
    },
    paint: {
      'line-width': 2,
    },
  });
}

function loadPosts(map, posts) {
  posts.forEach((post) => {
    if (post.location.latitude && post.location.longitude) {
      new mapboxgl.Marker()
        .setLngLat([post.location.longitude, post.location.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<a href="${post.link}" target="_blank"><img style="height:300px;width:300px" src=${post.images.standard_resolution.url}></a>`))
        .addTo(map);
    } else {
      console.log(post);
    }
  });
}

map.on('load', async () => {
  // loadItinerary(map, routes);
  loadGeoJsonSymbol(map, 'posts', posts);

  const routes = await mapUtils.getRoutes();
  const geoJsonRoutes = mapUtils.toGeoJson(routes);
  geoJsonRoutes.features.forEach((route, index) => loadGeoJsonLine(map, `route${index}`, route));

  const cities = await mapUtils.getCities();
  const geoJsonCities = mapUtils.toGeoJson(cities);
  loadGeoJsonSymbol(map, 'cities', geoJsonCities);

  const today = moment().format('DD/MM/YYYY');
  const currentLocation = mapUtils.getLocation(today, geoJsonCities.features);
  currentLocation.properties.icon = 'bus';
  loadGeoJsonSymbol(map, 'currentLocation', currentLocation);
});
