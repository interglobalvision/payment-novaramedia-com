Template.oneoff.onCreated(function () {
  var _this = this;

});

Template.oneoff.onRendered(function () {
  var _this = this;

});

Template.oneoff.events({

  'submit #oneoff': function(e, instance) {
    e.preventDefault();

    console.log(e);
    console.log(instance);

    var $form = $(e.target);
    var chargeAmount = $form.find('#donation-amount').val();

    $form.find('button').prop('disabled', true);

    Stripe.card.createToken($form, function(status, response) {

      if (status === 200) {

        console.log(response);
        Meteor.call('singleCharge', response, chargeAmount, function(err, response) {

          if (err) {
            console.log(err);
          } else {
            console.log(response);
            // success
            alert('thank you for donation!')

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