const axios = require('axios');

axios.get('https://spreadsheets.google.com/feeds/list/1nABudmgmscjQmmZZZUUCbyC8n4HHPeEVyg-KWw6LyKQ/1/public/values?alt=json')
  .then(response => {
    response.data.feed.entry.forEach(entry => console.log(entry.content.$t));
  })
  .catch(err => console.log(err));