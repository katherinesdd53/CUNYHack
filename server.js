var express = require('express');
var app     = express();
var path    = require("path");

app.use(express.static('static_files'));

app.listen(process.env.PORT || 3000, function(){
	console.log('listening to port 3000');
});

 app.get('/',function(req, res){
 	res.sendFile(__dirname + '/index.html');

 });

app.get('*', function(req,res){
	res.status(404).send("page doesn't exist!");

});

//watson api
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
	version_date: '2018-02-16',
    username: '761e9ce2-2abe-4b50-9590-7789bef68fc5',
    password: 'kWtvnkcWhUGW',
    "url": "https://gateway.watsonplatform.net/assistant/api"

});

var workspace_id = 'abf43946-7561-445f-87a4-992283c59294'; // replace with workspace ID

// Start conversation with empty message.
conversation.message({
  workspace_id: workspace_id
  }, processResponse);

// Process the conversation response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  // Display the output from dialog, if any.
  if (response.output.text.length != 0) {
      console.log(response.output.text[0]);
  }
}
