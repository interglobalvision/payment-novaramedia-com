function saveFundraiserAnalyticData() {

  var now = moment();
  var start = moment(Meteor.settings.goal.startDate);
  var end = moment(Meteor.settings.goal.endDate);

  var subscriptions = Subscriptions.find({createdAt: {$gte: start.toDate(), $lt: end.toDate(),},});
  var subscriptionsTotal = 0;

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

  var data = {
    'total': total,
    'percent': percent,
  };

  Analytics.insert({
    'time': now,
    'datatype': 'fundraiser',
    'data': data,
  });

};