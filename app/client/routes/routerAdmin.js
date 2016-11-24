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

    only: ['admin', 'export'],

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

  this.route('export', {
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

});