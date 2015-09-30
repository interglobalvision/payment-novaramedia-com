Template.header.helpers({
  notLoggedIn: function () {
    return !Meteor.user();
  },

});

Template.header.events({
  'click .log-out': function () {
    Meteor.logout();
  },

});