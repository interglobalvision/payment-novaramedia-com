Template.forgot.events = {
  'click input[type=submit]': function(e, template) {
    e.preventDefault();

    template.$('input[type=submit]').prop('disabled', true);

    var options = {
      email: template.$('#email').val(),
    };

    Accounts.forgotPassword(options, function(err) {
      template.$('input[type=submit]').prop('disabled', false);
      if (err) {
        template.$('#email').val('');
        Alerta.error(err.reason);
      } else {
        Alerta.message('Please check your emails for a password reset link');
      }
    });

  },
};