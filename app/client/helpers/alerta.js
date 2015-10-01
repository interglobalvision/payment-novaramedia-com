Alerta = {
  clear: function() {
    Session.set('alertaReset', true);
  },

  error: function(message) {
    var _this = this;
    var insert = 'Error: ' + message;

    Session.set('alerta', insert);

  },

  message: function(message) {
    Session.set('alerta', message);
  },
};