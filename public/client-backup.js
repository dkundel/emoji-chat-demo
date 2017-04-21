var client;
var channel;

function addMessage(author, message) {
  var chatBox = document.getElementById('chatBox');
  chatBox.innerHTML = '<p><strong>'+ author + '</strong>:' + emojione.toImage(message) + '</p>' + chatBox.innerHTML;
}

function send(emojiCode) {
  //addMessage('me', emojiCode);
  channel.sendMessage(emojiCode);
}

$.getJSON('/token', function (data) {
  client = new Twilio.Chat.Client(data.token);
  document.getElementById('identity').innerText = data.identity;
  client.initialize()
  .then(function () {
      return client.getChannelByUniqueName('🇧🇮');
  })
  .then(function (ch) {
    return ch;
  }, function () {
    return client.createChannel({ uniqueName: '🇧🇮' });
  })
  .then(function (ch) {
    channel = ch;
    channel.join();
    channel.on('messageAdded', function (msg) {
      addMessage(msg.author, msg.body);
    });
  })
  .catch(function (err) {
    console.error(err);
  });
});