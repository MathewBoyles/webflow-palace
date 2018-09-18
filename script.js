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
    getData();
  },
  error: function() {
    console.log("Unable to fetch key");
  }
})

function getData() {
  $.ajax({
    url: `https://api.webflow.com/sites?api_version=1.0.0&access_token=${APIKey}`,
    type: 'GET',
    contentType: 'application/json;',
    crossDomain: true,
    dataType: 'json',
    success: function(DataFromJson) {
      dataJson = DataFromJson;
      console.log(dataJson);
    },
    error: function() {
      console.log("Can't fetch ");
    }
  })
}