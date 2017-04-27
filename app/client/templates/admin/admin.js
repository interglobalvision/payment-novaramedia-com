var DashboardData = {
  // variables

  lastMonthStart: moment().subtract(1, 'month').toDate(),
  previousMonthStart: moment().subtract(2, 'month').toDate(),
  previousMonthEnd: moment().subtract(1, 'month').subtract(1, 'day').toDate(),

  // dontation functions

  donationsNumberLastMonth()  {
    var donations = Donations.find({createdAt: {$gte: DashboardData.lastMonthStart}});

    return this.returnCursorCount(donations);
  },

  donationsValueLastMonth() {
    var donations = Donations.find({createdAt: {$gte: DashboardData.lastMonthStart}});

    return this.returnValueOfCursorRecords(donations);
  },

  donationsNumberPreviousMonth() {
    var donations = Donations.find({createdAt: {$gte: DashboardData.previousMonthStart, $lt: DashboardData.previousMonthEnd}});

    return this.returnCursorCount(donations);
  },

  donationsValuePreviousMonth() {
    var donations = Donations.find({createdAt: {$gte: DashboardData.previousMonthStart, $lt: DashboardData.previousMonthEnd}});

    return this.returnValueOfCursorRecords(donations);
  },

  // subscription functions

  subscriptionsNumberLastMonth() {
    var subscriptions = Subscriptions.find({createdAt: {$gte: DashboardData.lastMonthStart}});

    return this.returnCursorCount(subscriptions);
  },

  subscriptionsValueLastMonth() {
    var subscriptions = Subscriptions.find({createdAt: {$gte: DashboardData.lastMonthStart}});

    return this.returnValueOfCursorRecords(subscriptions);
  },

  subscriptionsNumberPreviousMonth() {
    var subscriptions = Subscriptions.find({createdAt: {$gte: DashboardData.previousMonthStart, $lt: DashboardData.previousMonthEnd}});

    return this.returnCursorCount(subscriptions);
  },

  subscriptionsValuePreviousMonth() {
    var subscriptions = Subscriptions.find({createdAt: {$gte: DashboardData.previousMonthStart, $lt: DashboardData.previousMonthEnd}});

    return this.returnValueOfCursorRecords(subscriptions);
  },

  // utility functions

  returnCursorCount(collectionCursor) {
    var count = collectionCursor.count();

    return 0 + count;
  },

  returnValueOfCursorRecords(collectionCursor) {
    var value = 0;

    collectionCursor.forEach(function(record) {
      value += record.amount;
    });

    return value;
  },

  growthClasses(lastMonth, previousMonth) {
    if (lastMonth > previousMonth) {
      return 'positive-growth';
    } else {
      return 'negative-growth';
    }
  },
}

Template.admin.helpers({

  donationsNumberLastMonth()  {
    return DashboardData.donationsNumberLastMonth();
  },

  donationsValueLastMonth()  {
    return DashboardData.donationsValueLastMonth();
  },

  donationsNumberPreviousMonth()  {
    return DashboardData.donationsNumberPreviousMonth();
  },

  donationsValuePreviousMonth()  {
    return DashboardData.donationsValuePreviousMonth();
  },

  ifDonationsQuantityGrew() {
    return DashboardData.growthClasses(DashboardData.donationsNumberLastMonth(), DashboardData.donationsNumberPreviousMonth());
  },

  ifDonationsValueGrew() {
    return DashboardData.growthClasses(DashboardData.donationsValueLastMonth(), DashboardData.donationsValuePreviousMonth());
  },

  donationsTotal()  {
    var donationsTotal = 0;
    var donations = Donations.find();

    donations.forEach(function(donations) {
      donationsTotal += donations.amount;
    });

    return donationsTotal;
  },

  subscriptionsNumberLastMonth()  {
    return DashboardData.subscriptionsNumberLastMonth();
  },

  subscriptionsValueLastMonth() {
    return DashboardData.subscriptionsValueLastMonth();
  },

  subscriptionsNumberPreviousMonth()  {
    return DashboardData.subscriptionsNumberPreviousMonth();
  },

  subscriptionsValuePreviousMonth() {
    return DashboardData.subscriptionsValuePreviousMonth();
  },

  ifSubscriptionsQuantityGrew() {
    return DashboardData.growthClasses(DashboardData.subscriptionsNumberLastMonth(), DashboardData.subscriptionsNumberPreviousMonth());
  },

  ifSubscriptionsValueGrew() {
    return DashboardData.growthClasses(DashboardData.subscriptionsValueLastMonth(), DashboardData.subscriptionsValuePreviousMonth());
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