import test from 'ava';
import { getData, instagramURL } from './instagram';

test('should return the recent list of instagram posts', async(t) => {
  const posts = await getData(instagramURL);
  t.log(posts);
  t.is(posts.length, 20, 'message');
});