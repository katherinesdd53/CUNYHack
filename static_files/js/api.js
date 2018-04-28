// The Api module is designed to handle all interactions with the server

  var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';
  var google_key = '&key=AIzaSyAr7WpwVFOjYe__yGMA-CuIxXghQgLf3iU';
  var goo_map_url = "";
  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    },
     getMapPayload : function(){
      return mapPayLoad;
    },
    setMapPayload: function(newMapPayload){
      mapPayLoad = JSON.parse(newMapPayload);
    }
  };


  function check_zip_borough(input){
    var isZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(input);
    var isBorough = /^[a-zA-Z]+$/.test(input);
    if(isZip){
    //nyc job centers
    var nyc_data_Endpoint_zip = 'https://data.cityofnewyork.us/resource/9ri9-nbz5.json?zip_code=' + input;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', nyc_data_Endpoint_zip, false);
    xhr.send();
    var parsed = JSON.parse(xhr.response);
    if(parsed.length>=1){
        goo_map_url = JSON.stringify({"url":"https://maps.googleapis.com/maps/api/staticmap?center="+ parsed[0]['borough']+",&zoom=8&size=230x200&maptype=roadmap&markers=color:blue%7C"+parsed[0]['latitude']+","+parsed[0]['longitude'] + google_key});
        // Api.setMapPayload(goo_map_url);
        Api.setMapPayload(goo_map_url);
        console.log(goo_map_url);
      }
    }else if(isBorough){

      var nyc_data_Endpoint_borough= 'https://data.cityofnewyork.us/resource/9ri9-nbz5.json?zip_code=' + input;
    var api_call = new XMLHttpRequest();
    api_call.open('GET', nyc_data_Endpoint_borough, false);
    api_call.send();
    var borough_parsed = JSON.parse(api_call.response);

    if(borough_parsed.length>=1){
        //goo_map_url = JSON.stringify({"url":"https://maps.googleapis.com/maps/api/staticmap?center="+ parsed[0]['borough']+",&zoom=8&size=230x200&maptype=roadmap&markers=color:blue%7C"+parsed[0]['latitude']+","+parsed[0]['longitude'] + google_key});
        // Api.setMapPayload(goo_map_url);
        //Api.setMapPayload(goo_map_url);
        console.log(JSON.stringify(borough_parsed));
      }

    }
  };

  // Send a message request to the server
  function sendRequest(text, context) {
    // Build request payload
    var payloadToWatson = {};
    if (text) {
        check_zip_borough(text);
        payloadToWatson.input = {
        text: text
      };
    }
    if (context) {
      payloadToWatson.context = context;
    }

    // Built http request
    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        Api.setResponsePayload(http.responseText);
        //console.log('set response: ' + http.responseText);
      }
    };
    var params = JSON.stringify(payloadToWatson);
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
      //console.log(params);
    }

    // Send request
    http.send(params);
  }
}());