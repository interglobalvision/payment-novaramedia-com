Template.adminUser.helpers({
  displayEmail: function(user) {
    if (user) {
      return user.emails[0].address;
    }
  },
});

Template.adminUser.events({
  'click .action-check-customer-and-card': function() {
    console.log(this);

    Meteor.call('checkCustomerAndCard', this.user.profile.stripeCustomer, function(err, response) {

      if (err) {
        console.log(err);
        Alerta.error(err.reason);
      } else {
        console.log(response);

        if (response.stripeCard) {
          var expiry = moment(response.stripeCard.exp_year + '-' + response.stripeCard.exp_month + '-01').endOf('month');

          if (moment().isAfter(expiry)) {
            console.log('Main payment card is expired');
          }
        }

        if (response.stripeCustomer.subscriptions.total_count === 0) {
          console.log('No subscription found');
          $('.action-trim-subscription').removeClass('u-hidden');
        }

        Alerta.message('Check console for details');
      }

    });

  },

  'click .action-trim-subscription': function() {

    Meteor.call('trimSubscription', this.user.profile.stripeCustomer, this.subscription._id, function(err, response) {

      if (err) {
        console.log(err);
        Alerta.error(err.reason);
      } else {
        Alerta.message('Subscription Trimmed');
      }

    });

  },

  'click .action-delete': function() {

    if (window.confirm('Are you sure you want to delete this user?')) {
      Meteor.call('deleteUserById', this.user._id, function(err, response) {

        if (err) {
          console.log(err);
          Alerta.error(err.reason);
        } else {
          Alerta.message('User Deleted');
          Router.go('/admin');
        }

      });
    }

  },
});
