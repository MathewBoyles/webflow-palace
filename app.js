var express = require('express');
var app = express();
var cors = require('cors');

require('dotenv').config();

const Webflow = require('webflow-api');

const api_key = process.env.apikey;
let collections_id = process.env.collectionid;


const webflow = new Webflow({
  token: api_key
});

const items = webflow.items({
  collectionId: collections_id
}, {
  limit: 1
});

items.then(i => console.log(i));


// api.site({
//   // siteId: '580e63e98c9a982ac9b8b741'
// }).then(site => console.log(site));