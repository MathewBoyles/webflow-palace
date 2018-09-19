const express = require('express');
const app = express();
const cors = require('cors');
const Webflow = require('webflow-api');

require('dotenv').config();

const api_key = process.env.apikey;
const collections_id = process.env.collectionid;
const item_id = process.env.itemX;
let newItemID;

function pullData() {
  const webflow = new Webflow({
    token: api_key
  });
  const items = webflow.items({
    collectionId: collections_id
  }, {
    limit: 1
  });


  items.then(function(i) {
    console.log(i);
    // newItemID = i.items[0]._id;
    // deleteItem(newItemID);
  });
};

function create() {
  const webflow = new Webflow({
    token: api_key
  });

  const item = webflow.createItem({
    collectionId: collections_id,
    fields: {
      'name': 'Exciting blog post title',
      'slug': 'exciting-post',
      '_archived': false,
      '_draft': false,
    },
  });

  item.then(i => console.log(i));
}

function deleteItem() {

  const webflow = new Webflow({
    token: api_key
  });

  // Promise <{}>
  const removed = webflow.removeItem({
    collectionId: collections_id,
    itemId: newItemID
  })

  removed.then(x => console.log(x));
}



pullData();