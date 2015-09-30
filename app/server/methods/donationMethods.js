Meteor.methods({

  singleCharge: function(token, amount) {
    check(token, Match.ObjectIncluding({id: String,}));
    amount = parseFloat(amount);
    check(amount, Number);

    console.log(token.id);
    console.log(amount);

    var result = Meteor.call('stripeCreateCharge', token.id, amount);

    console.log(result);

    if (result.status === 'succeeded') {

      return Donations.insert({createdAt: new Date(), amount: amount, stripeResult: result,});

    } else {

      console.log('Stripe single charge failure:', result);
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

    var stripeCustomer = Meteor.call('stripeCreateCustomer', token.id, email);

    if (!stripeCustomer) {
      throw new Meteor.Error('stripe-customer-created-failed', 'Sorry Stripe failed to create the customer.');
    }

    // create meteor user with stripe customer id saved

    var newUser = Accounts.createUser({email: email, profile: {stripeCustomer: stripeCustomer.id,},});

    if (!newUser) {
      throw new Meteor.Error('account-creation-failed', 'Sorry failed to create a user account.');
    }

    // create stripe subscription

    var stripeSubscription = Meteor.call('stripeCreateSubscription', stripeCustomer.id, amount);

    if (!stripeSubscription) {
      throw new Meteor.Error('stripe-subscription-creation-failed', 'Sorry Stripe failed to create the subscription.');
    }

    // save stripe subscription to Subscription record

    var newSubscription = Subscriptions.insert({createdAt: new Date(), user: newUser, amount: amount, stripeId: stripeSubscription.id,});

    if (!newSubscription) {
      throw new Meteor.Error('subscription-creation-failed', 'Sorry failed to create a subscription record.');
    }

    return true;

  },

});