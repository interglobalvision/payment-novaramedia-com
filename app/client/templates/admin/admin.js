Template.admin.helpers({

  donationsNumberLastMonth()  {
    var start = moment().subtract(1, 'month').toDate();
    var donations = Donations.find({createdAt: {$gte: start}});
    var numberOfDonations = donations.count()

    return (0 + numberOfDonations);
  },

  donationsLastMonth()  {
    var donationsLastMonth = 0;
    var start = moment().subtract(1, 'month').toDate();
    var donations = Donations.find({createdAt: {$gte: start}});

    donations.forEach(function(donations) {
      donationsLastMonth += donations.amount;
    });

    return donationsLastMonth;
  },

  donationsValuePreviousMonth()  {
    var value = 0;
    var start = moment().subtract(2, 'month').toDate();
    var end = moment().subtract(1, 'month').subtract(1, 'day').toDate();
    var donations = Donations.find({createdAt: {$gte: start, $lt: end}});

    donations.forEach(function(donations) {
      value += donations.amount;
    });

    return value;
  },

  donationsNumberPreviousMonth()  {
    var start = moment().subtract(2, 'month').toDate();
    var end = moment().subtract(1, 'month').subtract(1, 'day').toDate();
    var donations = Donations.find({createdAt: {$gte: start, $lt: end}});
    var numberOfDonations = donations.count()

    return (0 + numberOfDonations);
  },

  donationsTotal()  {
    var donationsTotal = 0;
    var donations = Donations.find();

    donations.forEach(function(donations) {
      donationsTotal += donations.amount;
    });

    return donationsTotal;
  },

  subscriptionsValueLastMonth() {
    var value = 0;
    var start = moment().subtract(1, 'month').toDate();
    var subscriptions = Subscriptions.find({createdAt: {$gte: start}});

    subscriptions.forEach(function(subscriptions) {
      value += subscriptions.amount;
    });

    return value;
  },

  subscriptionsNumberLastMonth()  {
    var start = moment().subtract(1, 'month').toDate();
    var subscriptions = Subscriptions.find({createdAt: {$gte: start}});
    var numberOfSubscriptions = subscriptions.count();

    return (0 + numberOfSubscriptions);
  },

  subscriptionsValuePreviousMonth() {
    var value = 0;
    var start = moment().subtract(2, 'month').toDate();
    var end = moment().subtract(1, 'month').subtract(1, 'day').toDate();
    var subscriptions = Subscriptions.find({createdAt: {$gte: start, $lt: end}});

    subscriptions.forEach(function(subscriptions) {
      value += subscriptions.amount;
    });

    return value;
  },

  subscriptionsTotal() {
    var subscriptionsTotal = 0;
    var subscriptions = Subscriptions.find();

    subscriptions.forEach(function(subscriptions) {
      subscriptionsTotal += subscriptions.amount;
    });

    return subscriptionsTotal;

  },

});

Template.admin.events({
  'click .nuclear': function() {

    if (confirm('Are you really sure!!! This erases everything. You only want to do this when moving from dev to live keys')) {

      if (confirm('Last chance to stop mutually assured destruction?')) {

        Meteor.call('nuclear', function(err, result) {
          if (err) {
            console.log(err);
            Alerta.error(err.reason);
          } else {
            Alerta.message('Damn you really did this! That better be correct');
          }
        });

      }

    }

  },

});