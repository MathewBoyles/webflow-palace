// const express = require('express');
// const app = express();
// const cors = require('cors');
require('dotenv').config();
const Webflow = require('webflow-api');
const axios = require('axios');
const diff = require('arr-diff');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const parseString = require('xml2js').parseString;
const api_key = process.env.apikey;
const palaceEmail = process.env.palaceLogin;
const palacePass = process.env.palacePassword;
let collections_id = process.env.collectionid;
let item_id = process.env.itemX;
let itemCodetoDelete,itemPropCodeToDelete, listOfItems,itemsToDelete, name, propertyaddress1, propertyaddress2, propertyaddress3, propertyaddress4, propertycode, palacePropertys;
let uniquePropertyCodes = [];
let uniquePalacePropertyCodes = [];

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
      data: {}
    }).then(function(response) {
      parseString(response.data, function(err, result) {
        palacePropertys = result.ArrayOfViewAllDetailedProperty.ViewAllDetailedProperty;
        propertyaddress1 = palacePropertys[1].PropertyAddress1[0];
        propertyaddress2 = palacePropertys[1].PropertyAddress2[0];
        propertyaddress3 = palacePropertys[1].PropertyAddress3[0];
        propertyaddress4 = palacePropertys[1].PropertyAddress4[0];
        propertycode = palacePropertys[1].PropertyCode[0];
        name = `${propertycode} ${propertyaddress2} ${propertyaddress3} ${propertyaddress4}`;
        for (var i = 0; i < palacePropertys.length; i++) {
          uniquePalacePropertyCodes.push(palacePropertys[i].PropertyCode[0]);
        }
        pullData();

      })
    }).catch(function(error) {
      return;
    })
};

//Pull and init create if doesn't exist
function pullData() {
  const items = webflow.items({
    collectionId: collections_id
  });
  items.then(function(i) {
    listOfItems = i.items;
    for (var i = 0; i < listOfItems.length; i++) {
      uniquePropertyCodes.push(listOfItems[i].propertycode);
    }
    if (uniquePropertyCodes.includes(propertycode)) {
      console.log("exists already - STOP");
    } else {
      create();
    }
    //Checking to see if there is anything inside webflow thats not inside Palace to delete
    checkLiveItems();
  });
};

function create() {
  const item = webflow.createItem({
    collectionId: collections_id,
    fields: {
      'name': name,
      'propertycode': propertycode,
      'propertyaddress1': propertyaddress1,
      'propertyaddress2': propertyaddress2,
      'propertyaddress3': propertyaddress4,
      'propertyaddress4': propertyaddress4,
      '_archived': false,
      '_draft': false,
    },
  });
  item.then(function(i) {
    console.log(`Created item ${name}`);
  })
}

function checkLiveItems() {
  itemsToDelete = diff(uniquePropertyCodes, uniquePalacePropertyCodes);
  if (itemsToDelete.length == 0){
    console.log("Nothing to delete - STOPPED");
    return;
  }else {
    for (var i = 0; i < itemsToDelete.length; i++) {
      itemPropCodeToDelete = itemsToDelete[i];
      for (var i = 0; i < listOfItems.length; i++) {
        if (listOfItems[i].propertycode == itemPropCodeToDelete) {
        itemCodetoDelete = listOfItems[i]._id;
        deleteItem();
        }
      }
    }
  }
}

function deleteItem() {
  const removed = webflow.removeItem({
    collectionId: collections_id,
    itemId: itemCodetoDelete
  })
  removed.then(function(i) {
    console.log(`Delete item ${itemPropCodeToDelete} - STOPPED`);
  });
}

getPalaceListings();

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
