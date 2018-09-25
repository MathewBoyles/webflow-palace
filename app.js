// const express = require('express');
// const app = express();
// const cors = require('cors');
require('dotenv').config();
const Webflow = require('webflow-api');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const parseString = require('xml2js').parseString;
const api_key = process.env.apikey;
const palaceEmail = process.env.palaceLogin;
const palacePass = process.env.palacePassword;
let collections_id = process.env.collectionid;
let item_id = process.env.itemX;
let newItemID, listOfItems;
let palacePropertycode = 'RBPR000042';
let uniquePropertyCodes = [];
let name, propertyaddress1,propertyaddress2, propertyaddress3, propertyaddress4, propertycode,palacePropertys;


const webflow = new Webflow({
  token: api_key
});

function getPalaceListings() {
  let Pullconfig =
  axios.get('https://serviceapi.realbaselive.com/Service.svc/RestService/ViewAllDetailedProperty', {
    headers: {
     'Content-Type': 'application/json'
   },
    auth: {
      username: palaceEmail,
      password: palacePass
    },
    data:{}
  }).then(function(response) {
    parseString(response.data, function (err, result) {
        palacePropertys = result.ArrayOfViewAllDetailedProperty;
        propertyaddress1 = palacePropertys.ViewAllDetailedProperty[0].PropertyAddress1[0];
        propertyaddress2 = palacePropertys.ViewAllDetailedProperty[0].PropertyAddress2[0];
        propertyaddress3 = palacePropertys.ViewAllDetailedProperty[0].PropertyAddress3[0];
        propertyaddress4 = palacePropertys.ViewAllDetailedProperty[0].PropertyAddress4[0];
        propertycode = palacePropertys.ViewAllDetailedProperty[0].PropertyCode[0];
        name = `${propertycode} ${propertyaddress2} ${propertyaddress3} ${propertyaddress4}`
    })
    console.log("creating now");
    create();
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
    console.log(listOfItems);
    for (var i = 0; i < listOfItems.length; i++) {
      uniquePropertyCodes.push(listOfItems[i].propertycode);
    }
    if (uniquePropertyCodes.includes(propertycode)) {
      console.log("exists already");
    } else {
      create();
    }
  });
};

function create() {
  const item = webflow.createItem({
    collectionId: collections_id,
    fields: {
      'name': name,
      'propertycode': palacePropertycode,
      'propertyaddress1':propertyaddress1,
      'propertyaddress2':propertyaddress2,
      'propertyaddress3':propertyaddress4,
      'propertyaddress4':propertyaddress4,
      '_archived': false,
      '_draft': false,
    },
  });
  item.then(function(i) {
    console.log("created - Webflow propertyes listed below");
    pullData();
  })
}

//Delete - Not in use
function deleteItem() {
  const removed = webflow.removeItem({
    collectionId: collections_id,
    itemId: newItemID
  })
  removed.then(x => console.log(x));
}

// *****************START OF CRON************************

function sendCronEmail() {
  cron.schedule('*/2 * * * *', () => {
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  })
};


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'palacecronjob@gmail.com',
    pass: process.env.gpassword
  }
});

const mailOptions = {
  from: 'palacecronjob@gmail.com',
  to: 'elliot.sturzaker@nettl.com',
  subject: 'Cron Notification',
  text: 'Cron job has been completed'
};

// *****************END OF CRON************************

getPalaceListings();
