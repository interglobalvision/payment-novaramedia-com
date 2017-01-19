Meteor.methods({

  checkCustomerAndCard: function(stripeCustomerId) {
    check(stripeCustomerId, String);
    check(this.userId, String);

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-allowed', 'Sorry but you are not admin.');
    }

    var stripeCustomer = Meteor.call('stripeCheckCustomer', stripeCustomerId);

    if (!stripeCustomer) {
      throw new Meteor.Error('customer-check-failed', 'Sorry failed to check the Stripe customer.');
    }

    var stripeCard = Meteor.call('stripeCheckCard', stripeCustomer.id, stripeCustomer.default_source);

    if (!stripeCard) {
      throw new Meteor.Error('card-check-failed', 'Sorry failed to check the Stripe card.');
    }

    var data = {
      'stripeCustomer': stripeCustomer,
      'stripeCard': stripeCard,
    };

    return data;

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