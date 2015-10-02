Template.footer.helpers({
  isLoggedIn: function () {
    return !!Meteor.user();
  },

});

Template.footer.events({
  'click .logout': function() {
    Meteor.logout();
  },

});