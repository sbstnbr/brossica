import test from 'ava';

import map from './map';

const cities = [
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        2.2533313,
        48.9220615,
      ],
    },
    properties: {
      to: '06/09/2018',
      name: 'Colombes',
      icon: 'circle',
      description: '<h2>Colombes</h2><p>06/09/2018</p>',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        -1.795493,
        46.492958,
      ],
    },
    properties: {
      to: '11/09/2018',
      name: 'Les Sables Olonne',
      icon: 'circle',
      description: '<h2>Les Sables Olonne</h2><p>11/09/2018</p>',
    },
  },
];

test('should return an empty object if no city is provided', (t) => {
  t.deepEqual(map.getLocation(null, null), {}, 'message');
});

test('should return the city which date corresponds to the date provided', (t) => {
  const date = '06/09/2018';
  t.deepEqual(map.getLocation(date, cities), cities[0], 'message');
});

test('should return the closest city in the past if not found', (t) => {
  const date = '07/09/2018';
  t.deepEqual(map.getLocation(date, cities), cities[0], 'message');
});

test('should return the list of cities', async (t) => {
  const result = await map.getCities();
  t.true(result.length > 0);
});

test('should return the list of routes', async (t) => {
  const result = await map.getRoutes();
  t.log(result[0]);
  t.true(result.length > 0);
});


test('should convert a list of places to GeoJson format', (t) => {
  const places = [{
    lat: 48.9220615,
    lng: 2.2533313,
    to: '06/09/2018',
    name: 'Colombes',
    icon: 'circle',
    description: '<h2>Colombes</h2><p>06/09/2018</p>',
  }];
  const expected = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            2.2533313,
            48.9220615,
          ],
        },
        properties: {
          to: '06/09/2018',
          name: 'Colombes',
          icon: 'circle',
          description: '<h2>Colombes</h2><p>06/09/2018</p>',
        },
      },
    ],
  };
  t.deepEqual(map.toGeoJson(places), expected, 'message');
});

test('should convert a list of routes to GeoJson format', (t) => {
  const routes = [
    { route: [[0, 0], [1, 1]] },
    { route: [[2, 2], [3, 3]] },
  ];
  const expected = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
        properties: {},
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [2, 2],
            [3, 3],
          ],
        },
        properties: {},
      },
    ],
  };
  t.deepEqual(map.toGeoJson(routes), expected, 'message');
});
