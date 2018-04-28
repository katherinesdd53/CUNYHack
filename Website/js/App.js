var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.sendFile('/Users/katherine/Desktop/NYCProject/Website/index.html');
});

app.listen(3000);
