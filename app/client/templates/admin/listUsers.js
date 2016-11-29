Template.listUsers.helpers({
  displayEmail: function(userId) {
    var user = Meteor.users.findOne(userId);

    return user.emails[0].address;
  },
});