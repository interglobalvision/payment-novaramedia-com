Meteor.methods({

  apiGoal: function() {
    var start = moment(Meteor.settings.goal.startDate);
    var end = moment(Meteor.settings.goal.endDate);

    var subscriptions = Subscriptions.find({createdAt: {$gte: start.toDate(), $lt: end.toDate(),},});
    var subscriptionsTotal = 0;

    console.log(subscriptions);

    subscriptions.forEach(function (post) {
      subscriptionsTotal += post.amount;
    });

    var donations = Donations.find({createdAt: {$gte: start.toDate(), $lt: end.toDate(),},});
    var donationsTotal = 0;

    donations.forEach(function (post) {
      donationsTotal += post.amount;
    });

    var total = subscriptionsTotal + donationsTotal + Meteor.settings.goal.externalDonationsAmount;
    var percent = total / Meteor.settings.goal.goalAmount;

    return {
      'total': total,
      'percent': percent,
      'timeLeft': end.fromNow(),
      'timeLeftValue': end.fromNow(true),
    };

  },

});