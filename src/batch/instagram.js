import axios from 'axios';
import existingPosts from './../data/posts.json';
import fs from 'fs';

const instagramURL = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=6756377666.0bf922c.05fc969e40cb4233993910dd6f12ed63'

async function getData(url){
  const response = await axios.get(url);
  return response.data.data;
}

function updatePostList(existingList, newList){
  return existingList.concat(newList).filter((post,index,self)=> self.map(post=>post.caption.id).indexOf(post.caption.id) === index)
}

getData(instagramURL)
  .then(data => {
    console.log('Existing posts: '+existingPosts.length+' / Updated posts: '+data.length);
    return data;
  })
  .then(data => updatePostList(existingPosts,data))
  .then(posts => fs.writeFile(__dirname+'/../data/posts.json', JSON.stringify(posts), (err) => {  
    if (err) throw err;
    console.log("Posts saved");
  }))
  .catch(err => console.error(err))

export { 
  getData, updatePostList,
  instagramURL 
}