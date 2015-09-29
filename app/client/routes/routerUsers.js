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
      }
    },
  });
});