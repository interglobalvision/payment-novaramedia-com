Template.forgot.events = {
  'click input[type=submit]': function(e, template) {
    e.preventDefault();

    var options = {
      email: $('#email').val(),
    };

    Accounts.forgotPassword(options, function(error) {
      if (error) {
        $('#email').val('');
        Alerta.error(error.reason);
      } else {
        Router.go('/login');
      }
    });

  },
};