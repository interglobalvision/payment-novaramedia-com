Template.profile.events = {
  'click .cancel-subscription': function(e) {
    e.preventDefault();

    Meteor.call('deleteSubscription', this.subscription._id, function(err, result) {
      if (err) {
        console.log(err);
      }
    });

  },

  'submit #edit-subscription': function(e, template) {
    e.preventDefault();
    var amount = template.$('#edit-subscription-donation-amount').val();

    if (this.subscription.amount === parseInt(amount)) {
      alert('Please enter a new subscription amount');
    }

    Meteor.call('editSubscription', this.subscription._id, amount, function(err, result) {
      if (err) {
        console.log(err);
      }
    });

  },

  'submit #new-subscription': function(e, template) {
    e.preventDefault();
    var amount = template.$('#new-subscription-donation-amount').val();

    Meteor.call('newSubscription', amount, function(err, result) {
      if (err) {
        console.log(err);
      }
    });

  },

  'click .delete-account': function(e) {
    e.preventDefault();

    if (window.confirm('Are you sure you want to delete your account? This will also remove any donation subscriptions you have')) {

      Meteor.call('deleteUser', function(err, result) {
        if (err) {
          console.log(err);
        }
      });

    }
  },
};