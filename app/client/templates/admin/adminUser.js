Template.adminUser.helpers({
  displayEmail: function(user) {
    if (user) {
      return user.emails[0].address;
    }
  },
});

Template.adminUser.events({
  'click .action-check-customer-and-card': function() {

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

        Alerta.message('Check console for details');
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
