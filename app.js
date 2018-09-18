const Webflow = require('webflow-api');


const api = new Webflow({
  token: 'api-token'
});

api.site({
  // siteId: '580e63e98c9a982ac9b8b741'
}).then(site => console.log(site));