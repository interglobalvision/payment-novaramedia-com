Template.header.helpers({
  notLoggedIn: function () {
    return !Meteor.user();
  },

});