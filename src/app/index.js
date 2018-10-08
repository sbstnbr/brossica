import mapboxgl from 'mapbox-gl';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2JzdG5iciIsImEiOiJjamwybm0xOXYwMDcwM3Fwa3h0amZsZ2F3In0.dT34qctpNYbAjJCN5nrMsQ';

const map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [12.35,57.82],
  zoom: 2.35,
  minZoom: 2.35,
  maxZoom: 4.5,
});

const itinerary = [
  [2.2431251, 48.9237226], [0.54338, 45.04037], [2.1734035, 41.3850639], [0.9236691, 40.9908991], [0.1050557, 38.8387992], [-0.8379313, 37.8054749], [-0.7200237, 37.6311518], [-2.9048012, 37.333506], [-4.4213988, 36.7212737], [-6.2885962, 36.5270612], [-5.9844589, 37.3890924], [-6.9447224, 37.261421], [-7.6430019, 37.1335906], [-7.9304397, 37.0193548], [-8.4677851, 37.1068147], [-8.9405858, 37.0168316], [-8.6730275, 37.1027881], [-8.8941, 38.5254047], [-9.1393366, 38.7222524], [-8.6291053, 41.1579438], [-3.1568245, 43.2742682], [-3.8099803, 43.4623057], [-8.4863157, 51.8968917], [-8.5222327, 51.7058853], [-9.8188888, 51.4522222], [-10.1983505, 51.5967169], [-9.42651, 52.97188], [-10.0202388, 53.4891345], [-8.4666667, 54.45], [-7.6350788, 55.2056262], [-6.5115554, 55.2408073], [-5.93012, 54.597285], [-5.0268868, 54.976479], [-4.251806, 55.864237], [-5.4736237, 55.803296], [-6.177067, 55.7362535], [-5.4736237, 55.803296], [-6.2262725, 57.5359261], [-4.224721, 57.477773], [-2.094278, 57.149717], [-2.970721, 56.462018], [-3.188267, 55.953252], [-2.2426305, 53.4807593], [-1.61778, 54.978252], [4.8951679, 52.3702157], [8.6821267, 50.1109221], [13.404954, 52.5200066], [9.9936819, 53.5510846], [12.5683372, 55.6760968], [13.003822, 55.604981], [11.97456, 57.70887], [10.7522454, 59.9138688], [5.3220544, 60.3912628], [10.3950528, 63.4305149], [14.404916, 67.2803556], [13.6397069, 67.9931452], [15.3275932, 68.0167764], [25.7836599, 71.1709533], [25.7293906, 66.5039478], [24.9383791, 60.1698557], [24.7535747, 59.4369608], [24.1051865, 56.9496487], [25.2796514, 54.6871555], [21.0122287, 52.2296756], [19.040235, 47.497912], [24.7963878, 46.2197025], [26.1025384, 44.4267674], [28.9783589, 41.0082376], [22.3585552, 40.0884128], [21.6305896, 39.7217044], [19.8186982, 41.3275459], [18.771234, 42.424662], [18.0944238, 42.6506606], [16.4401935, 43.5081323], [13.7301877, 45.548059], [12.3155151, 45.4408474], [13.518915, 43.6158299], [16.8718715, 41.1171432], [14.4989344, 40.7461572], [9.0851765, 45.8080597], [11.8440351, 46.4102117], [11.5819805, 48.1351253], [2.2431251, 48.9237226]
];

map.on('load', function () {
  // getItinerary(itinerary);
  itinerary.forEach((point,index) => {
    getRoute(point, itinerary[index+1])
      .then(route => map.addLayer({
        id: 'route'+point,
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route
          }
        },
        paint: {
          'line-width': 2
        }
      }));
    });
});


function getItinerary(itinerary) {
  map.addLayer({
    "id": "route",
    "type": "line",
    "source": {
        "type": "geojson",
        "data": {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": itinerary
            }
        }
    },
    "layout": {
        "line-join": "round",
        "line-cap": "round"
    },
    "paint": {
        "line-color": "#147ED1",
        "line-width": 2
    }
});
}

async function getRoute(start,end) {
  const directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
  const response = await axios.get(directionsRequest);
  return response.data.routes[0].geometry;  
}

// const posts = [{"latitude":48.68416667,"longitude":-2.31888889,"name":"Phare du Cap Fréhel","id":268065044,"link":"https://www.instagram.com/p/BjNNeLrg-xu/","url":"https://scontent.cdninstagram.com/vp/595435c1dd1fabdc8d9a926682a00e4a/5B7D813A/t51.2885-15/sh0.08/e35/s640x640/32010892_440989066341291_2803244292749918208_n.jpg"},{"latitude":21.524584174418,"longitude":-87.3783165297,"name":"Holbox","id":1587058004919142,"link":"https://www.instagram.com/p/BiXPkOfAHyp/","url":"https://scontent.cdninstagram.com/vp/e4831f9a9746451f0bc009176dd7821c/5BF27408/t51.2885-15/sh0.08/e35/s640x640/31072597_386617825171660_4991587893077082112_n.jpg"},{"latitude":48.8567,"longitude":2.3508,"name":"Paris, France","id":6889842,"link":"https://www.instagram.com/p/Bg8Ggg9Fi5Y/","url":"https://scontent.cdninstagram.com/vp/d698dcd9669948bab58dd315aad6db91/5C0E89A0/t51.2885-15/sh0.08/e35/p640x640/29402380_293449187855623_35699866948599808_n.jpg"},{"latitude":36.662071546788,"longitude":24.468787928479,"name":"Tsigrado","id":787464514,"link":"https://www.instagram.com/p/BYwHTikBiyl/","url":"https://scontent.cdninstagram.com/vp/2551ea8e66c30586c9ff36a70dfdc451/5C0CB15D/t51.2885-15/sh0.08/e35/s640x640/21373390_383122455437833_684827742163697664_n.jpg"},{"latitude":36.418385068443,"longitude":25.431777475234,"name":"Santorini - Greece","id":1832714103629932,"link":"https://www.instagram.com/p/BYlmaoilX8D/","url":"https://scontent.cdninstagram.com/vp/e950e4e7b8afd55dec2f3ced02dfb38e/5B7DBCA6/t51.2885-15/e15/s640x640/21296917_524754171202677_829469003603771392_n.jpg"},{"latitude":31.0992,"longitude":-4.01167,"name":"Merzouga","id":41251823,"link":"https://www.instagram.com/p/BXk7m3ul-hc/","url":"https://scontent.cdninstagram.com/vp/166656500663d4ee4dfc76c6fabaf27f/5BF6EDD2/t51.2885-15/sh0.08/e35/s640x640/20635361_488452661504155_7104228253816061952_n.jpg"},{"latitude":50.848333,"longitude":4.349444,"name":"Bourse premetro station","id":412461385496639,"link":"https://www.instagram.com/p/BXSVXfilEcw/","url":"https://scontent.cdninstagram.com/vp/e227b2334e5dac2601451371a8cf6632/5BFCD936/t51.2885-15/sh0.08/e35/s640x640/20589430_110635526245305_7788714056453455872_n.jpg"},{"latitude":36.0125,"longitude":-5.60556,"name":"Tarifa, Spain","id":220455631,"link":"https://www.instagram.com/p/BWwsfovFCOL/","url":"https://scontent.cdninstagram.com/vp/bc67297b6dceefd6eb595dc0809a7167/5C3BA33E/t51.2885-15/sh0.08/e35/s640x640/20067047_1173831776055712_4174598501067390976_n.jpg"},{"latitude":44.126944,"longitude":9.709444,"name":"Cinque Terre","id":793648604,"link":"https://www.instagram.com/p/BWnOyX6lEae/","url":"https://scontent.cdninstagram.com/vp/28dd7ea809ab3e8e0c50e0d2e13019cc/5BF50D74/t51.2885-15/sh0.08/e35/s640x640/19933358_1895821700681323_442291888146350080_n.jpg"},{"latitude":44.126944,"longitude":9.709444,"name":"Cinque Terre","id":323916237,"link":"https://www.instagram.com/p/BWc6q7RlBJ_/","url":"https://scontent.cdninstagram.com/vp/05edd55fd07d66b173c82d5451e98f74/5C3B7C51/t51.2885-15/sh0.08/e35/s640x640/20065253_480604232272575_6577025673976610816_n.jpg"},{"latitude":35.1714,"longitude":-5.26972,"name":"Chefchaouene","id":228755448,"link":"https://www.instagram.com/p/BVUaZrUhf8D/","url":"https://scontent.cdninstagram.com/vp/e674526fa0ab8608bd89979987ba05d8/5C002555/t51.2885-15/sh0.08/e35/s640x640/19120262_1570776179600718_5435385171555647488_n.jpg"},{"latitude":35.1714,"longitude":-5.26972,"name":"Chefchaouene","id":228755448,"link":"https://www.instagram.com/p/BVCuJ4xhXQk/","url":"https://scontent.cdninstagram.com/vp/6af8e960638e666cf31759d2439902f5/5C194C7F/t51.2885-15/sh0.08/e35/s640x640/18949699_144129802800133_5432681768815689728_n.jpg"},{"latitude":35.1714,"longitude":-5.26972,"name":"Chefchaouene","id":228755448,"link":"https://www.instagram.com/p/BU_1OwShCS2/","url":"https://scontent.cdninstagram.com/vp/95e8645c4411d650a84f4d3480d4b13b/5C0E4930/t51.2885-15/sh0.08/e35/s640x640/18879184_1767359089948049_3383644208668606464_n.jpg"},{"latitude":35.1714,"longitude":-5.26972,"name":"Chefchaouene","id":228755448,"link":"https://www.instagram.com/p/BUwnkY3B9kZ/","url":"https://scontent.cdninstagram.com/vp/47b7dd535bd0bb92823d079300bed7ba/5C00AC6C/t51.2885-15/sh0.08/e35/s640x640/18879795_299297463849498_149471888467296256_n.jpg"},{"latitude":64.251051352,"longitude":-21.1294075259,"name":"Þingvellir, Arnessysla, Iceland","id":234417504,"link":"https://www.instagram.com/p/BUMkItcByrh/","url":"https://scontent.cdninstagram.com/vp/71161e85bb8bcbaf63d1adc693219e76/5BF4D1A6/t51.2885-15/sh0.08/e35/s640x640/18514138_773128979522045_6322594731939332096_n.jpg"},{"latitude":64.048294271622,"longitude":-16.179870923798,"name":"Jökulsárlón","id":458399384,"link":"https://www.instagram.com/p/BTqNfgQBpDv/","url":"https://scontent.cdninstagram.com/vp/4d049abd792592f142e28318efc66111/5C38668B/t51.2885-15/sh0.08/e35/s640x640/18252869_1747351172222984_1677486201432440832_n.jpg"},{"latitude":48.85343,"longitude":2.37995,"name":"PARIS HANOI OFFICIEL","id":236472189,"link":"https://www.instagram.com/p/BTW4SB4BQSD/","url":"https://scontent.cdninstagram.com/vp/be9c87d94344914c6f0fbf64d45b2150/5C00E140/t51.2885-15/sh0.08/e35/s640x640/18013208_1325755624178375_8633500085960835072_n.jpg"},{"latitude":45.444754655,"longitude":12.32242641,"name":"Cinque Terre, Manarola","id":248373945,"link":"https://www.instagram.com/p/BTE35CNhs0q/","url":"https://scontent.cdninstagram.com/vp/9254bb647d6c5d8c708457dc93c6f251/5BF20BC8/t51.2885-15/sh0.08/e35/s640x640/18013241_1041492912648964_6119450870556917760_n.jpg"},{"latitude":64.0167,"longitude":-22.5667,"name":"Keflavík","id":235172964,"link":"https://www.instagram.com/p/BRbE5SyBjqB/","url":"https://scontent.cdninstagram.com/vp/8c6511cf86c8d5777010868cbdb3f759/5C18990E/t51.2885-15/sh0.08/e35/s640x640/17126110_1724183274579147_50334985189588992_n.jpg"}];

// posts.forEach(post => {
//   if (post.latitude && post.longitude) {
//     L.marker([post.latitude, post.longitude]).bindPopup('<img style="height:100px;width:100px" src='+post.url+'>').addTo(map)
//   } else {
//     console.log(post);
//   }
// });