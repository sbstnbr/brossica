import test from 'ava';
import {
  getData, updatePostList,
  instagramURL,
} from './instagram';

test('should return the recent list of instagram posts', async (t) => {
  const posts = await getData(instagramURL);
  t.is(posts.length, 20, 'message');
});

test('should save new posts if not already existing', (t) => {
  const existingList = [
    { caption: { id: 1 } },
    { caption: { id: 2 } },
  ];
  const newList = [
    { caption: { id: 2 } },
    { caption: { id: 3 } },
  ];
  const expectedList = [
    { caption: { id: 1 } },
    { caption: { id: 2 } },
    { caption: { id: 3 } },
  ];
  t.deepEqual(updatePostList(existingList, newList), expectedList, 'message');
});
