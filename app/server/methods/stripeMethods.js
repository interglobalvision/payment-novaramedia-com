var Stripe = StripeAPI(Meteor.settings.stripe.secret);

var syncChargesCreate = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);
var syncCustomersCreate = Meteor.wrapAsync(Stripe.customers.create, Stripe.customers);
var syncSubscriptionsCreate = Meteor.wrapAsync(Stripe.customers.createSubscription, Stripe.customers);

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

  },

  createSubscription: function(email, token, amount) {
    check(email, String);
    check(token, Match.ObjectIncluding({id: String,}));
    amount = parseInt(amount);
    check(amount, Number);

    console.log('amount', amount);

    // check for existing meteor user

    if (Accounts.findUserByEmail(email)) {
      throw new Meteor.Error('account-exists', 'You already have an account with this email. To add/change/remove subscriptions please log in first.');
    }

    // create stripe customer

    try {

      var stripeCustomer = syncCustomersCreate({
        source: token.id,
        email: email,
      });

    } catch(error) {
      console.log('Stripe customer create error:', error);
      throw new Meteor.Error('stipe-account-creation-failed', 'Sorry Stripe failed to create a user account.');
    }

    // create meteor user with stripe customer id saved

    var newUser = Accounts.createUser({email: email, profile: {stripeCustomer: stripeCustomer.id},});

    if (!newUser) {
      throw new Meteor.Error('account-creation-failed', 'Sorry failed to create a user account.');
    }

    // create stripe subscription

    try {

      var stripeSubscription = syncSubscriptionsCreate(stripeCustomer.id ,{
        plan: 'novarasub',
        quantity: amount,
      });

    } catch(error) {
      console.log('Stripe subscription create error:', error);
      throw new Meteor.Error('stipe-subscription-creation-failed', 'Sorry Stripe failed to create the subscription.');
    }

    // save stripe subscription to Subscription record

    var newSubscription = Subscriptions.insert({createdAt: new Date(), user: newUser, amount: amount, stripeId: stripeSubscription.id,});

    if (!newSubscription) {
      throw new Meteor.Error('subscription-creation-failed', 'Sorry failed to create a subscription record.');
    }

    return true;

  }
});