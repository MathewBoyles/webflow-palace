var APIKey, siteID, collectionID, itemID;


$.ajax({
  url: "data.json",
  dataType: "json",
  beforeSend: function(xhr) {
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType("application/json");
    }
  },
  success: function(DataFromJson) {
    APIKey = DataFromJson.apikey;
    siteID = DataFromJson.siteid;
    collectionID = DataFromJson.collectionid;
    itemID = DataFromJson.itemX;
    getData();
  },
  error: function() {
    console.log("Unable to fetch key");
  }
})

// function getData() {
//   $.ajax({
//     url: `https://api.webflow.com/sites?api_version=1.0.0&access_token=${APIKey}`,
//     type: 'GET',
//     contentType: 'application/json;',
//     crossDomain: true,
//     dataType: 'json',
//     success: function(DataFromJson) {
//       console.log(DataFromJson);
//     },
//     error: function() {
//       console.log("Can't fetch ");
//     }
//   })
// }
//
// function getData() {
//   $.ajax({
//     url: `https://api.webflow.com/collections?api_version=1.0.0&access_token=${APIKey}`,
//     type: 'GET',
//     contentType: 'application/json;',
//     crossDomain: true,
//     dataType: 'json',
//     success: function(DataFromJson) {
//       console.log(DataFromJson);
//     },
//     error: function() {
//       console.log("Can't fetch ");
//     }
//   })
// }
//
//
//
function getData() {
  $.ajax({
    url: `https://api.webflow.com/collections/${collectionID}/items/?api_version=1.0.0&access_token=${APIKey}`,
    type: 'GET',
    contentType: 'application/json;',
    crossDomain: true,
    dataType: 'json',
    success: function(DataFromJson) {
      console.log(DataFromJson);
      getDatas();
    },
    error: function() {
      console.log("Can't fetch ");
    }
  })
}
var email = {
  'propertyaddress1': '11',
  'propertyaddress2': 'elliot',
};

function getDatas() {
  $.ajax({
    url: `https://api.webflow.com/collections/${collectionID}/items/${itemID}/?api_version=1.0.0&access_token=${APIKey}?live=true`,
    type: "PATCH",
    data: email,
    contentType: 'application/json',
    crossDomain: true,
    dataType: 'json',
    success: function(data) {
      console.log(DataFromJson);
      getDatas();
    },
    error: function() {
      console.log("Can't fetch ");
    }
  })
}



// function getDatas() {
//   $.ajax({
//     url: `https://api.webflow.com/collections/${collectionID}/items?api_version=1.0.0&access_token=${APIKey}&live=true`,
//     type: "POST",
//     data: `{"fields": [{"test": "10"}]`,
//     contentType: 'application/json;',
//     crossDomain: true,
//     dataType: 'json',
//     success: function(data) {
//       console.log(data);
//       getData();
//     },
//     error: function() {
//       console.log("Can't fetch ");
//     }
//   })
// }