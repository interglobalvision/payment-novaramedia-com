Meteor.methods({
  deleteSubscription: function(subscriptionId) {
    check(subscriptionId, String);

    var subscription = Subscriptions.findOne(subscriptionId);

    if (!subscription) {
      throw new Meteor.Error('doesnt-exist', 'Sorry that subscription doesnt exist.');
    }

    if (subscription.user !== this.userId) {
      throw new Meteor.Error('not-allowed', 'You dont have permission to do that.');
    }

    var user = Meteor.users.findOne(this.userId);

    if (Meteor.call('stripeCancelSubscription', user.profile.stripeCustomer, subscription.stripeId)) {
      Subscriptions.remove(subscription._id);
    }

  },

  editSubscription: function(subscriptionId, amount) {
    check(subscriptionId, String);
    amount = parseInt(amount);
    check(amount, Number);

    var subscription = Subscriptions.findOne(subscriptionId);

    if (!subscription) {
      throw new Meteor.Error('doesnt-exist', 'Sorry that subscription doesnt exist.');
    }

    if (subscription.user !== this.userId) {
      throw new Meteor.Error('not-allowed', 'You dont have permission to do that.');
    }

    var user = Meteor.users.findOne(this.userId);

    // update Stripe subscription with new amount

    var updatedSubscription = Meteor.call('stripeUpdateSubscription', user.profile.stripeCustomer, subscription.stripeId, amount);

    if (!updatedSubscription) {
      throw new Meteor.Error('subscription-update-failed', 'Sorry failed to update the Stripe subscription.');
    }

    // update Meteor subscription record

    return Subscriptions.update(subscription._id, {$set: {amount: amount,},});

  },

  newSubscription: function(amount) {
    amount = parseInt(amount);
    check(amount, Number);

    var user = Meteor.users.findOne(this.userId);

    // create stripe subscription

    var stripeSubscription = Meteor.call('stripeCreateSubscription', user.profile.stripeCustomer, amount);

    if (!stripeSubscription) {
      throw new Meteor.Error('stripe-subscription-creation-failed', 'Sorry Stripe failed to create the subscription.');
    }

    // save stripe subscription to Subscription record

    var newSubscription = Subscriptions.insert({createdAt: new Date(), user: user._id, amount: amount, stripeId: stripeSubscription.id,});

    if (!newSubscription) {
      throw new Meteor.Error('subscription-creation-failed', 'Sorry failed to create a subscription record.');
    }

    return true;

  },

  deleteUser: function() {
    check(this.userId, String);

    // cancel all subscriptions

    var userSubscriptions = Subscriptions.find({user: this.userId});

    if (userSubscriptions.count() > 0) {

      var user = Meteor.users.findOne(this.userId);

      userSubscriptions.forEach(function(subscription) {

        if (Meteor.call('stripeCancelSubscription', user.profile.stripeCustomer, subscription.stripeId)) {
          Subscriptions.remove(subscription._id);
        }
      });

    }

    // delete Stripe customer

    var deletedStripeCustomer = Meteor.call('stripeDeleteCustomer', user.profile.stripeCustomer);
    if (!deletedStripeCustomer) {
      throw new Meteor.Error('stripe-customer-delete-failed', 'Sorry Stripe failed to delete the customer.');
    }

    // remove meteor user

    return Meteor.users.remove(this.userId);

  },

});