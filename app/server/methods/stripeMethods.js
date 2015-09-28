var Stripe = StripeAPI(Meteor.settings.stripe.secret);

var syncChargesCreate = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);

Meteor.methods({
  singleCharge: function(token, amount) {
    check(token, Match.ObjectIncluding({id: String,}));
    amount = parseFloat(amount);
    check(amount, Number);

    var result = syncChargesCreate({
      amount: (amount * 100),
      currency: 'gbp',
      source: token.id,
      description: 'Donation to Novara Media',
    });

    if (result.status === 'succeeded') {

      return Donations.insert({createdAt: new Date(), amount: amount, stripeResult: result,});

    } else {

      console.log('Stripe single charge failure:');
      console.log(result);
      throw new Meteor.Error('card-charge-failure', 'Sorry but your card charge failed.');

    }

  }
});