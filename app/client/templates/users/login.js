Template.login.events = {
  'click input[type=submit]': function(e) {
    e.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();

    Meteor.loginWithPassword(username, password, function(error) {
      if (error) {
        Alerta.error(error.reason);
      } else {
        Router.go('/');
      }
    });
  },
};