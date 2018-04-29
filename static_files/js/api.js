// The Api module is designed to handle all interactions with the server

  var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';
  var google_key = '&key=AIzaSyBy-g97EjhrdxpxuZkAAn2wkc9ULCMC7Sw';
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
        var name = parsed[0]['facility_name'];
        var google_address = "https://maps.google.com/?q= "+ name + parsed[0]['street_address']+" "+parsed[0]['state']+" "+parsed[0]['zip_code'];
        goo_map_url = JSON.stringify({"name":name,"address_link": google_address ,"url":"https://maps.googleapis.com/maps/api/staticmap?center="+ parsed[0]['borough']+",&zoom=10&size=250x200&maptype=roadmap&markers=color:blue%7C"+parsed[0]['latitude']+","+parsed[0]['longitude'] + google_key});
        Api.setMapPayload(goo_map_url);
      }
    }else if(isBorough){
    input = input.charAt(0).toUpperCase() + input.substr(1);

    var nyc_data_Endpoint_borough= 'https://data.cityofnewyork.us/resource/kjtk-8yxq.json?borough=' + input;
    var api_call = new XMLHttpRequest();
    api_call.open('GET', nyc_data_Endpoint_borough, false);
    api_call.send();
    var borough_parsed = JSON.parse(api_call.response);
    if(borough_parsed.length>=1){
        var name = borough_parsed[0]['center_name'];
        var google_address = "https://maps.google.com/?q= " +borough_parsed[0]['address'] + " NY "+borough_parsed[0]['postcode'];
        goo_map_url = JSON.stringify({"name":name,"address_link": google_address,"url":"https://maps.googleapis.com/maps/api/staticmap?center="+ borough_parsed[0]['borough']+",&zoom=10&size=230x200&maptype=roadmap&markers=color:green%7C"+borough_parsed[0]['latitude']+","+borough_parsed[0]['longitude'] + google_key});
        Api.setMapPayload(goo_map_url);
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