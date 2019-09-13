// functions

function saveFundraiserAnalyticData() {

  if (Meteor.settings.fundraiser.enable !== true) {
    return;
  }

  // Create moment objects for start and end
  var now = moment();
  var start = moment(Meteor.settings.fundraiser.startDate);
  var end = moment(Meteor.settings.fundraiser.endDate);

  // Get all subs in timescale
  var subscriptions = Subscriptions.find({createdAt: {$gte: start.toDate(), $lt: end.toDate(),},});
  var subscriptionsTotal = 0;

  // Total all subs
  subscriptions.forEach(function (post) {
    subscriptionsTotal += parseInt(post.amount);
  });

  // Add any external donations
  var total = subscriptionsTotal + Meteor.settings.fundraiser.externalDonationsAmount;

  // If not a subsraiser then get all donations in timescale too
  if (Meteor.settings.fundraiser.subsraiser !== true) {

    var donations = Donations.find({createdAt: {$gte: start.toDate(), $lt: end.toDate(),},});
    var donationsTotal = 0;

    // Total the donations
    donations.forEach(function (post) {
      donationsTotal += parseInt(post.amount);
    });

    // And add to the overall total
    total += donationsTotal;
  }

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