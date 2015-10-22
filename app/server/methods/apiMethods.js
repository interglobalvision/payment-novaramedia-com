Meteor.methods({

  apiTotal: function() {

    var subscriptions = Subscriptions.find();
    var subscriptionsTotal = 0;
    subscriptions.forEach(function (post) {
      subscriptionsTotal += post.amount;
    });

//     console.log('Total in subs', subscriptionsTotal);

    var donations = Donations.find();
    var donationsTotal = 0;
    donations.forEach(function (post) {
      donationsTotal += post.amount;
    });

//     console.log('Total in donations', donationsTotal);

    return subscriptionsTotal + donationsTotal;

  },

});