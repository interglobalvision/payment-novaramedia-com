/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// On before

Router.onBeforeAction(function () {

    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      this.next();
    } else {
      this.redirect('/');
    }

  }, {

    only: ['admin', 'listDonations', 'listUsers', 'singleUser',],

});

// Routes

Router.map(function() {

  this.route('admin', {
    waitOn: function () {
      return [
        Meteor.subscribe('donations'),
        Meteor.subscribe('subscriptions'),
      ];
    },

    data: function () {
      return {
        donations: Donations.find({}, {sort: {createdAt: -1,},}),
        subscriptions: Subscriptions.find({}, {sort: {createdAt: -1,},}),
      };
    },
  });

  this.route('listDonations', {
    path: '/admin/donations',
    waitOn: function () {
      return [
        Meteor.subscribe('donations'),
        Meteor.subscribe('subscriptions'),
      ];
    },

    data: function () {
      return {
        donations: Donations.find({}, {sort: {createdAt: -1,},}),
        subscriptions: Subscriptions.find({}, {sort: {createdAt: -1,},}),
      };
    },
  });

  this.route('listEmails', {
    path: '/admin/emails',
    waitOn: function () {
      return [
        Meteor.subscribe('subscriptions'),
        Meteor.subscribe('users'),
      ];
    },

    data: function () {
      return {
        subscriptions: Subscriptions.find({}, {sort: {createdAt: -1,},}),
        users: Meteor.users.find(),
      };
    },
  });

  this.route('listUsers', {
    path: '/admin/users',
    waitOn: function () {
      return [
        Meteor.subscribe('subscriptions'),
        Meteor.subscribe('users'),
      ];
    },

    data: function () {
      return {
        subscriptions: Subscriptions.find({}, {sort: {createdAt: -1,},}),
        users: Meteor.users.find(),
      };
    },
  });

  this.route('singleUser', {
    path: '/admin/user/:_id',
    template: 'adminUser',

    waitOn: function () {
      return [
        Meteor.subscribe('singleUser', this.params._id),
        Meteor.subscribe('singleSubscription', this.params._id),
      ];
    },

    data: function () {
      return {
        user: Meteor.users.findOne(this.params._id),
        subscription: Subscriptions.findOne(),
      };
    },
  });

  this.route('tools', {
    path: '/admin/tools',
    waitOn: function () {
      return [
        Meteor.subscribe('subscriptions'),
        Meteor.subscribe('users'),
      ];
    },

    data: function () {
      return {
        subscriptions: Subscriptions.find({}, {sort: {createdAt: -1,},}),
        users: Meteor.users.find({}, {sort: {createdAt: -1,},}),
      };
    },
  });

});