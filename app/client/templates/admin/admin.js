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

  donationsQuantityGrowthClasses() {
    return DashboardData.growthClasses(DashboardData.donationsNumberLastMonth(), DashboardData.donationsNumberPreviousMonth());
  },

  donationsQuantityValueClasses() {
    return DashboardData.growthClasses(DashboardData.donationsValueLastMonth(), DashboardData.donationsValuePreviousMonth());
  },

  donationsTotal()  {
    var donations = Donations.find();

    return DashboardData.returnCursorCount(donations)
  },

  donationsTotalValue()  {
    var donations = Donations.find();

    return DashboardData.returnValueOfCursorRecords(donations)
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

  subscriptionsQuantityGrowthClasses() {
    return DashboardData.growthClasses(DashboardData.subscriptionsNumberLastMonth(), DashboardData.subscriptionsNumberPreviousMonth());
  },

  subscriptionsValueGrowthClasses() {
    return DashboardData.growthClasses(DashboardData.subscriptionsValueLastMonth(), DashboardData.subscriptionsValuePreviousMonth());
  },

  subscriptionsTotal() {
    var subscriptions = Subscriptions.find();

    return DashboardData.returnValueOfCursorRecords(subscriptions)
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