
var client = io.connect();
client.on('connect', function() {
  console.log("client connected");
});

client.on('updatechat', function (username, data) {
  $('#chat').append('<b>' + username + ':</b> ' + data + '<br>');
});

client.on('disconnect', function () {
  console.log("disconnected");
});

function processData() {
  var message = $('#data').val();
  $('#data').val('');
  client.emit('sendchat', message);
}

$(
  function() {
    $('#senddata').click(function() {
      processData();
    });
    $('#data').keypress(function(e) {
      if (e.which == 13) {
        processData();
      }
    });
  }
);

