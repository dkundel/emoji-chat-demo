// Node/Express
var express = require('express');
var path = require('path');
var Twilio = require('twilio');
var sillyname = require('sillyname');

var AccessToken = Twilio.jwt.AccessToken;
var IpMessagingGrant = AccessToken.IpMessagingGrant;

// Create Express webapp
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/token', function(request, response) {
    
    // Create an access token which we will sign and return to the client
    var token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET
    );

    // Assign the generated identity to the token
    token.identity = sillyname() + ' ' + Math.random().toString().substr(2, 3);
    
    // Create a 'grant' which enables a client to use IPM as a given user,
    // on a given device
    var ipmGrant = new IpMessagingGrant({
        serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
        endpointId: 'Demo:' + token.identity + ':Browser'
    });
    token.addGrant(ipmGrant);
   
    //Serialize the token to a JWT string and include it in a JSON response
    response.send({
        identity: token.identity,
        token: token.toJwt()
    });
});

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Express server running on *:' + port);
});