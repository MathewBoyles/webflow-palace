const express = require('express');
const app = express();
const cors = require('cors');
const Webflow = require('webflow-api');

require('dotenv').config();

const api_key = process.env.apikey;
let collections_id = process.env.collectionid;
let item_id = process.env.itemX;
let newItemID, listOfItems;

const webflow = new Webflow({
  token: api_key
});

let palacePropertycode = 'RBPR000042';
let uniquePropertyCodes = [];

function pullData() {
  const items = webflow.items({
    collectionId: collections_id
  }, {
    limit: 24
  });
  items.then(function(i) {
    listOfItems = i.items;
    for (var i = 0; i < listOfItems.length; i++) {
      uniquePropertyCodes.push(listOfItems[i].palacePropertycode);
    }
    if (uniquePropertyCodes.includes(palacePropertycode)) {
      return;
    } else {
      create();
    }
  });
};

function create() {
  const item = webflow.createItem({
    collectionId: collections_id,
    fields: {
      'name': 'Exciting blog post title',
      'propertycode': 'RBPR000042',
      '_archived': false,
      '_draft': false,
    },
  });

  item.then(i => console.log(i));
}

function deleteItem() {
  const removed = webflow.removeItem({
    collectionId: collections_id,
    itemId: newItemID
  })

  removed.then(x => console.log(x));
}

pullData();