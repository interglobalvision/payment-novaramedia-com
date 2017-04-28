// functions

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

  var record = {
    'createdAt': now.toDate(),
    'datatype': 'fundraiser',
    'data': data,
  };

  console.log('analytics record', record);

  Analytics.insert(record);
};

// cron jobs

SyncedCron.add({
  name: 'analyticsFundraiser',
  schedule: function(parser) {
    return parser.text(Meteor.settings.goal.updateAnalyticsFrequency);
  },

  job: function() {
    return saveFundraiserAnalyticData();
  },
});

Meteor.startup(function() {
  SyncedCron.start();
});