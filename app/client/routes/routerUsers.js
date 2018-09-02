Router.map(function() {

  this.route('login');

  this.route('forgot');

  this.route('profile', {
    waitOn: function () {
      return [
        Meteor.subscribe('userSubscriptions'),
      ];
    },

    data: function () {
      return {
        subscription: Subscriptions.findOne(),
      };
    },
  });
});

Accounts.onLogin(function() {
  // If the user is not an admin route them to root on login. This is because only admin type logged in users need to go to any routes
  if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
    Router.go('/');
  }
});