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

    only: ['admin',],

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
        donations: Donations.find(),
        subscriptions: Subscriptions.find(),
      };
    },
  });

});
