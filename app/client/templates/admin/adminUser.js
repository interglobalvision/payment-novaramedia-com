Template.adminUser.helpers({
  displayEmail: function(user) {
    if (user) {
      return user.emails[0].address;
    }
  },
});

Template.adminUser.events({
  'click .action-delete': function() {

    if (window.confirm('Are you sure you want to delete this user?')) {
      Meteor.call('deleteUserById', this.user._id, function(err, response) {

        if (err) {
          console.log(err);
          Alerta.error(err.reason);
        } else {
          Alerta.message('User Deleted');
          Router.go('/admin');
        }

      });
    }

  },
});
