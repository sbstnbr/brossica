import test from 'ava';

import { getRoute, boatRoutes } from './map';

test('should return a straight line for boat rides', async (t) => {
  const route = await getRoute(boatRoutes[0].start, boatRoutes[0].end);
  t.is(route.data.uuid, 'boat');
});
