import test from 'ava';

import { getRoute, boatRoute } from './map';

test('should return a straight line for boat rides', async (t) => {
  const route = await getRoute(boatRoute.start, boatRoute.end);
  t.is(route.data.uuid, 'boat');
});
