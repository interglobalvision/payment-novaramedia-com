Template.adminUser.helpers({
  displayEmail: function(user) {
    if (user) {
      return user.emails[0].address;
    }
  },
});

Template.adminUser.events({
  'click .action-check-customer': function() {

    Meteor.call('checkCustomer', this.user.profile.stripeCustomer, function(err, response) {

      if (err) {
        console.log(err);
        Alerta.error(err.reason);
      } else {
        if (response.sources.total_count > 0) {
          var expiry = moment(response.sources.data[0].exp_year + '-' + response.sources.data[0].exp_month + '-01').endOf('month');

          if (moment().isAfter(expiry)) {
            console.log('Main payment card is expired');
          }
        }

        if (response.subscriptions.total_count === 0) {
          console.log('No subscription found');
          $('.action-trim-subscription').removeClass('u-hidden');
        }

        console.log(response);
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

  'click .action-reanchor-subscription': function() {

    Meteor.call('reanchorSubscription', this.user.profile.stripeCustomer, this.subscription.stripeId, function(err, response) {

      if (err) {
        console.log(err);
        Alerta.error(err.reason);
      } else {
        Alerta.message('Subscription Re-anchored');
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
