Template.subscription.onCreated(function () {
  var _this = this;

});

Template.subscription.onRendered(function () {
  var _this = this;

  if (_this.data.amount) {
    _this.$('#donation-amount').val(parseInt(_this.data.amount));
  }

});

Template.subscription.events({

  'submit #subscription': function(e, instance) {
    e.preventDefault();

    var $form = $(e.target);
    var chargeAmount = $form.find('#donation-amount').val();
    var email = $form.find('#email').val();

    $form.find('button').prop('disabled', true);

    Stripe.card.createToken($form, function(status, response) {

      if (status === 200) {

        console.log(response);
        Meteor.call('createSubscription', email, response, chargeAmount, function(err, response) {

          if (err) {
            console.log(err);
            alert(err.message);
          } else {
//             console.log(response);
            Router.go('/thanks');

          }

          $form.find('button').prop('disabled', false);

        });

      } else if (status === 400) {

        // Bad Request	Often missing a required parameter.
        console.log(response);

        $form.find('button').prop('disabled', false);


      } else if (status === 402) {

        // Request Failed	Parameters were valid but request failed.
        console.log(response);

        $form.find('button').prop('disabled', false);

      }

    });

  }

});