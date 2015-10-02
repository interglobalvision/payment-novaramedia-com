Template.oneoff.onCreated(function () {
  var _this = this;

});

Template.oneoff.onRendered(function () {
  var _this = this;

  if (_this.data.amount) {
    _this.$('#donation-amount').val(parseInt(_this.data.amount));
  }

});

Template.oneoff.events({

  'click .trigger-optional-address': function(e, template) {
    e.preventDefault();

    template.$('.optional-address').toggle();
  },

  'submit #oneoff': function(e) {
    e.preventDefault();

    var $form = $(e.target);
    var chargeAmount = $form.find('#donation-amount').val();

    $form.find('button').prop('disabled', true);
    Alerta.message('Processing donation');

    Stripe.card.createToken($form, function(status, response) {

      if (status === 200) {

        Meteor.call('singleCharge', response, chargeAmount, function(err, response) {

          if (err) {
            console.log(err);
            Alerta.error('Charge failed. Your card could be declined, you could have entered invalid details or our server could be having problems.');
          } else {
            Alerta.clear();
            Router.go('/thanks');
          }

          $form.find('button').prop('disabled', false);

        });

      } else if (status === 400 || status === 402) {

        Alerta.error(response.error.message);

        $form.find('button').prop('disabled', false);

      } else {

        Alerta.error('Problem with payment processor Stripe. Please check your card details or try again later');

      }

    });

  },

});