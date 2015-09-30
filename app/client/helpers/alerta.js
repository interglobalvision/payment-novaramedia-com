Alerta = {
  error: function(message) {
    var _this = this;

    var insert = 'Error: ' + message;

    Session.set('alerta', message);

  },
};