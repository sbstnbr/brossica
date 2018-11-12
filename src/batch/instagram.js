import axios from 'axios';

const instagramURL = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=6756377666.0bf922c.05fc969e40cb4233993910dd6f12ed63';

async function getData(url) {
  const response = await axios.get(url);
  return response.data.data;
}

const updatePostList = (existingList, newList) => existingList
  .concat(newList)
  .filter((post, index, self) => self.map(p => p.caption.id).indexOf(post.caption.id) === index);

export {
  getData, updatePostList,
  instagramURL,
};
