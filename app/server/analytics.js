// functions

function saveFundraiserAnalyticData() {

  if (Meteor.settings.fundraiser.enable !== true) {
    return;
  }

  var now = moment();
  var start = moment(Meteor.settings.fundraiser.startDate);
  var end = moment(Meteor.settings.fundraiser.endDate);

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

  var total = subscriptionsTotal + donationsTotal + Meteor.settings.fundraiser.externalDonationsAmount;
  var percent = total / Meteor.settings.fundraiser.goalAmount;

  var data = {
    'total': total,
    'percent': percent,
  };

  var record = {
    'createdAt': now.toDate(),
    'datatype': 'fundraiser',
    'data': data,
  };

  Analytics.insert(record);
};

// cron jobs

if (Meteor.settings.fundraiser.enable === true) {

  SyncedCron.add({
    name: 'analyticsFundraiser',
    schedule: function(parser) {
      return parser.text(Meteor.settings.fundraiser.updateAnalyticsFrequency);
    },

    job: function() {
      return saveFundraiserAnalyticData();
    },
  });

}

Meteor.startup(function() {
  SyncedCron.start();
});