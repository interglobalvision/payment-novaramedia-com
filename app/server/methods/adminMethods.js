Meteor.methods({

  checkCustomerAndCard: function(customerId) {
    check(customerId, String);
    check(this.userId, String);

    console.log('customer id', customerId);

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-allowed', 'Sorry but you are not admin.');
    }

    var stripeCustomer = Meteor.call('stripeCheckCustomer', customerId);

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