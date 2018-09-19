const express = require('express');
const app = express();
const cors = require('cors');
const Webflow = require('webflow-api');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

require('dotenv').config();

const api_key = process.env.apikey;
let collections_id = process.env.collectionid;
let item_id = process.env.itemX;
let newItemID, listOfItems;
let palacePropertycode = 'RBPR000042';
let uniquePropertyCodes = [];

const webflow = new Webflow({
  token: api_key
});

//API Get Palace goes here
function getPalaceListings() {
  axios.get('URL GOES HERE').then(function(response) {
    console.log(response);
  }).catch(function(error) {
    return;
  })
};

//Pull and init create if doesn't exist
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
      'propertycode': palacePropertycode,
      '_archived': false,
      '_draft': false,
    },
  });
  item.then(i => console.log(i));
}

//Delete - Not in use
function deleteItem() {
  const removed = webflow.removeItem({
    collectionId: collections_id,
    itemId: newItemID
  })
  removed.then(x => console.log(x));
}


//START OF EMAIL CRON
cron.schedule('*/2 * * * *', () => {
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'esturz23@gmail.com',
    pass: process.env.gpassword
  }
});

const mailOptions = {
  from: 'esturz23@gmail.com',
  to: 'elliot.sturzaker@nettl.com',
  subject: 'Cron Notification',
  text: 'Cron job has been completed'
};
//END OF EMAIL CRON