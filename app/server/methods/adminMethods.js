Meteor.methods({

  checkCustomer: function(stripeCustomerId) {
    check(stripeCustomerId, String);
    check(this.userId, String);

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-allowed', 'Sorry but you are not admin.');
    }

    var stripeCustomer = Meteor.call('stripeCheckCustomer', stripeCustomerId);

    if (!stripeCustomer) {
      throw new Meteor.Error('customer-check-failed', 'Sorry failed to check the Stripe customer.');
    }

    return stripeCustomer;

  },

  trimSubscription: function(stripeCustomerId, subscriptionId) {
    check(stripeCustomerId, String);
    check(subscriptionId, String);

    check(this.userId, String);

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-allowed', 'Sorry but you are not admin.');
    }

    var stripeCustomer = Meteor.call('stripeCheckCustomer', stripeCustomerId);

    if (!stripeCustomer) {
      throw new Meteor.Error('customer-check-failed', 'Sorry failed to check the Stripe customer.');
    }

    if (stripeCustomer.subscriptions.total_count === 0) {
      return Subscriptions.remove(subscriptionId);
    } else {
      throw new Meteor.Error('subscription-trim-failed', 'Stripe customer still has associated subscription');
    }

  },

  reanchorSubscription: function(stripeCustomerId, subscriptionId) {
    check(stripeCustomerId, String);
    check(subscriptionId, String);

    check(this.userId, String);

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-allowed', 'Sorry but you are not admin.');
    }

    var stripeCustomer = Meteor.call('stripeCheckCustomer', stripeCustomerId);

    if (!stripeCustomer) {
      throw new Meteor.Error('customer-check-failed', 'Sorry failed to find the Stripe customer.');
    }

    if (!stripeCustomer.subscriptions.total_count === 0) {
      throw new Meteor.Error('subscription-reanchor-failed', 'No subscriptions found for Stripe user');
    }

    var updatedStripeSubscription = Meteor.call('stripeUpdateSubscriptionBillingAnchor', stripeCustomerId, subscriptionId);

    if (!updatedStripeSubscription) {
      throw new Meteor.Error('subscription-reanchor-failed', 'Error with subscription update');
    }

    console.log('updatedStripeSubscription', updatedStripeSubscription);

    return updatedStripeSubscription;
  },

  createImminentlyFailingSubscription: function() {

    // check if admin

    check(this.userId, String);

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-allowed', 'Sorry but you are not admin.');
    }

    // create dummy values

    const email = 'somethingstupid' + Math.floor(Math.random() * Math.floor(100)) + '@google.com';
    const amount = 5;

    // check for existing meteor user (just in case!)

    if (Accounts.findUserByEmail(email)) {
      throw new Meteor.Error('account-exists', 'You already have an account with this email. To add/change/remove subscriptions please log in first.');
    }

    // create stripe customer

    const token = Meteor.call('stripeCreateTestToken', '4242424242424242');

    if (!token) {
      throw new Meteor.Error('stripe-customer-created-failed', 'Sorry Stripe failed to create the test token.');
    }

    const stripeCustomer = Meteor.call('stripeCreateCustomer', token.id, email);

    if (!stripeCustomer) {
      throw new Meteor.Error('stripe-customer-created-failed', 'Sorry Stripe failed to create the customer.');
    }

    // create meteor user with stripe customer id saved

    var newUser = Accounts.createUser({email: email, profile: {stripeCustomer: stripeCustomer.id,},});

    if (!newUser) {
      throw new Meteor.Error('account-creation-failed', 'Sorry failed to create a user account.');
    }

    // create stripe subscription

    var stripeSubscription = Meteor.call('stripeCreateImminentSubscription', stripeCustomer.id, amount);

    if (!stripeSubscription) {
      throw new Meteor.Error('stripe-subscription-creation-failed', 'Sorry Stripe failed to create the subscription.');
    }

    // update user with failing source so first billing invoice fails

    const failingToken = Meteor.call('stripeCreateTestToken', '4000000000000341');

    if (!failingToken) {
      throw new Meteor.Error('stripe-customer-created-failed', 'Sorry Stripe failed to create the failing token.');
    }

    var updatedStripeCustomer = Meteor.call('stripeUpdateCustomerSource', stripeCustomer.id, failingToken.id);

    if (!updatedStripeCustomer) {
      throw new Meteor.Error('stripe-customber-update-failed', 'Sorry Stripe failed to update the customer.');
    }

    // save stripe subscription to Subscription record

    var newSubscription = Subscriptions.insert({createdAt: new Date(), user: newUser, amount: amount, stripeId: stripeSubscription.id,});

    if (!newSubscription) {
      throw new Meteor.Error('subscription-creation-failed', 'Sorry failed to create a subscription record.');
    }

    Accounts.sendEnrollmentEmail(newUser);

    return true;
  }

/*
  nuclear: function() {
    check(this.userId, String);

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-allowed', 'Sorry but you are not admin. You cant delete the whole world');
    }

    var donations = Donations.remove({});

    console.log('Deleted donation records', donations);

    var users = Meteor.users.find({_id: {$ne: this.userId,},});

    users.forEach(function(user) {

      console.log('Deleting user', user._id);
      Meteor.call('deleteUserById', user._id);

    });

  },
*/

});