import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import routes from '../batch/routes.json';
import dummyPosts from '../data/posts.json';
import data from '../data/posts_20181015.json';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2JzdG5iciIsImEiOiJjamwybm0xOXYwMDcwM3Fwa3h0amZsZ2F3In0.dT34qctpNYbAjJCN5nrMsQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [12.35, 57.82],
  zoom: 2.35,
  minZoom: 2.35,
  maxZoom: 4.5,
});


map.on('load', function () {
  loadItinerary(map, routes);
  // loadDummyPosts(map);
  loadPosts(map,data);
});

// When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'places', function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var description = e.features[0].properties.description;

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup({className: "popup"})
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
  
  // Loads instagram picture
  instgrm.Embeds.process()
});

// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'places', function () {
  map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'places', function () {
  map.getCanvas().style.cursor = '';
});


function loadItinerary(map, routes) {
  routes.forEach(route => {
    map.addLayer({
      id: 'route' + route.uuid,
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: route.routes[0].geometry
        }
      },
      paint: {
        'line-width': 2
      }
    });
  });
}

function loadDummyPosts(map) {
  map.addLayer({
    "id": "places",
    "type": "symbol",
    "source": posts,
    "layout": {
      "icon-image": "{icon}-15",
      "icon-allow-overlap": true
    }
  });
}

function loadPosts(map,data){
  const posts = data.data;
  posts.forEach(post => {
    if (post.location.latitude && post.location.longitude) {
      new mapboxgl.Marker()
        .setLngLat([post.location.longitude, post.location.latitude])
        .setPopup(new mapboxgl.Popup().setHTML('<img style="height:300px;width:300px" src='+post.images.standard_resolution.url+'>'))
        .addTo(map);
    } else {
      console.log(post);
    }
  });
  
}

// const posts = [{"latitude":48.68416667,"longitude":-2.31888889,"name":"Phare du Cap Fréhel","id":268065044,"link":"https://www.instagram.com/p/BjNNeLrg-xu/","url":"https://scontent.cdninstagram.com/vp/595435c1dd1fabdc8d9a926682a00e4a/5B7D813A/t51.2885-15/sh0.08/e35/s640x640/32010892_440989066341291_2803244292749918208_n.jpg"},{"latitude":21.524584174418,"longitude":-87.3783165297,"name":"Holbox","id":1587058004919142,"link":"https://www.instagram.com/p/BiXPkOfAHyp/","url":"https://scontent.cdninstagram.com/vp/e4831f9a9746451f0bc009176dd7821c/5BF27408/t51.2885-15/sh0.08/e35/s640x640/31072597_386617825171660_4991587893077082112_n.jpg"},{"latitude":48.8567,"longitude":2.3508,"name":"Paris, France","id":6889842,"link":"https://www.instagram.com/p/Bg8Ggg9Fi5Y/","url":"https://scontent.cdninstagram.com/vp/d698dcd9669948bab58dd315aad6db91/5C0E89A0/t51.2885-15/sh0.08/e35/p640x640/29402380_293449187855623_35699866948599808_n.jpg"},{"latitude":36.662071546788,"longitude":24.468787928479,"name":"Tsigrado","id":787464514,"link":"https://www.instagram.com/p/BYwHTikBiyl/","url":"https://scontent.cdninstagram.com/vp/2551ea8e66c30586c9ff36a70dfdc451/5C0CB15D/t51.2885-15/sh0.08/e35/s640x640/21373390_383122455437833_684827742163697664_n.jpg"},{"latitude":36.418385068443,"longitude":25.431777475234,"name":"Santorini - Greece","id":1832714103629932,"link":"https://www.instagram.com/p/BYlmaoilX8D/","url":"https://scontent.cdninstagram.com/vp/e950e4e7b8afd55dec2f3ced02dfb38e/5B7DBCA6/t51.2885-15/e15/s640x640/21296917_524754171202677_829469003603771392_n.jpg"},{"latitude":31.0992,"longitude":-4.01167,"name":"Merzouga","id":41251823,"link":"https://www.instagram.com/p/BXk7m3ul-hc/","url":"https://scontent.cdninstagram.com/vp/166656500663d4ee4dfc76c6fabaf27f/5BF6EDD2/t51.2885-15/sh0.08/e35/s640x640/20635361_488452661504155_7104228253816061952_n.jpg"},{"latitude":50.848333,"longitude":4.349444,"name":"Bourse premetro station","id":412461385496639,"link":"https://www.instagram.com/p/BXSVXfilEcw/","url":"https://scontent.cdninstagram.com/vp/e227b2334e5dac2601451371a8cf6632/5BFCD936/t51.2885-15/sh0.08/e35/s640x640/20589430_110635526245305_7788714056453455872_n.jpg"},{"latitude":36.0125,"longitude":-5.60556,"name":"Tarifa, Spain","id":220455631,"link":"https://www.instagram.com/p/BWwsfovFCOL/","url":"https://scontent.cdninstagram.com/vp/bc67297b6dceefd6eb595dc0809a7167/5C3BA33E/t51.2885-15/sh0.08/e35/s640x640/20067047_1173831776055712_4174598501067390976_n.jpg"},{"latitude":44.126944,"longitude":9.709444,"name":"Cinque Terre","id":793648604,"link":"https://www.instagram.com/p/BWnOyX6lEae/","url":"https://scontent.cdninstagram.com/vp/28dd7ea809ab3e8e0c50e0d2e13019cc/5BF50D74/t51.2885-15/sh0.08/e35/s640x640/19933358_1895821700681323_442291888146350080_n.jpg"},{"latitude":44.126944,"longitude":9.709444,"name":"Cinque Terre","id":323916237,"link":"https://www.instagram.com/p/BWc6q7RlBJ_/","url":"https://scontent.cdninstagram.com/vp/05edd55fd07d66b173c82d5451e98f74/5C3B7C51/t51.2885-15/sh0.08/e35/s640x640/20065253_480604232272575_6577025673976610816_n.jpg"},{"latitude":35.1714,"longitude":-5.26972,"name":"Chefchaouene","id":228755448,"link":"https://www.instagram.com/p/BVUaZrUhf8D/","url":"https://scontent.cdninstagram.com/vp/e674526fa0ab8608bd89979987ba05d8/5C002555/t51.2885-15/sh0.08/e35/s640x640/19120262_1570776179600718_5435385171555647488_n.jpg"},{"latitude":35.1714,"longitude":-5.26972,"name":"Chefchaouene","id":228755448,"link":"https://www.instagram.com/p/BVCuJ4xhXQk/","url":"https://scontent.cdninstagram.com/vp/6af8e960638e666cf31759d2439902f5/5C194C7F/t51.2885-15/sh0.08/e35/s640x640/18949699_144129802800133_5432681768815689728_n.jpg"},{"latitude":35.1714,"longitude":-5.26972,"name":"Chefchaouene","id":228755448,"link":"https://www.instagram.com/p/BU_1OwShCS2/","url":"https://scontent.cdninstagram.com/vp/95e8645c4411d650a84f4d3480d4b13b/5C0E4930/t51.2885-15/sh0.08/e35/s640x640/18879184_1767359089948049_3383644208668606464_n.jpg"},{"latitude":35.1714,"longitude":-5.26972,"name":"Chefchaouene","id":228755448,"link":"https://www.instagram.com/p/BUwnkY3B9kZ/","url":"https://scontent.cdninstagram.com/vp/47b7dd535bd0bb92823d079300bed7ba/5C00AC6C/t51.2885-15/sh0.08/e35/s640x640/18879795_299297463849498_149471888467296256_n.jpg"},{"latitude":64.251051352,"longitude":-21.1294075259,"name":"Þingvellir, Arnessysla, Iceland","id":234417504,"link":"https://www.instagram.com/p/BUMkItcByrh/","url":"https://scontent.cdninstagram.com/vp/71161e85bb8bcbaf63d1adc693219e76/5BF4D1A6/t51.2885-15/sh0.08/e35/s640x640/18514138_773128979522045_6322594731939332096_n.jpg"},{"latitude":64.048294271622,"longitude":-16.179870923798,"name":"Jökulsárlón","id":458399384,"link":"https://www.instagram.com/p/BTqNfgQBpDv/","url":"https://scontent.cdninstagram.com/vp/4d049abd792592f142e28318efc66111/5C38668B/t51.2885-15/sh0.08/e35/s640x640/18252869_1747351172222984_1677486201432440832_n.jpg"},{"latitude":48.85343,"longitude":2.37995,"name":"PARIS HANOI OFFICIEL","id":236472189,"link":"https://www.instagram.com/p/BTW4SB4BQSD/","url":"https://scontent.cdninstagram.com/vp/be9c87d94344914c6f0fbf64d45b2150/5C00E140/t51.2885-15/sh0.08/e35/s640x640/18013208_1325755624178375_8633500085960835072_n.jpg"},{"latitude":45.444754655,"longitude":12.32242641,"name":"Cinque Terre, Manarola","id":248373945,"link":"https://www.instagram.com/p/BTE35CNhs0q/","url":"https://scontent.cdninstagram.com/vp/9254bb647d6c5d8c708457dc93c6f251/5BF20BC8/t51.2885-15/sh0.08/e35/s640x640/18013241_1041492912648964_6119450870556917760_n.jpg"},{"latitude":64.0167,"longitude":-22.5667,"name":"Keflavík","id":235172964,"link":"https://www.instagram.com/p/BRbE5SyBjqB/","url":"https://scontent.cdninstagram.com/vp/8c6511cf86c8d5777010868cbdb3f759/5C18990E/t51.2885-15/sh0.08/e35/s640x640/17126110_1724183274579147_50334985189588992_n.jpg"}];

// posts.forEach(post => {
//   if (post.latitude && post.longitude) {
//     L.marker([post.latitude, post.longitude]).bindPopup('<img style="height:100px;width:100px" src='+post.url+'>').addTo(map)
//   } else {
//     console.log(post);
//   }
// });