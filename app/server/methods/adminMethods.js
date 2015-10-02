Meteor.methods({

  nuclear: function() {
    check(this.userId, String);

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-allowed', 'Sorry but you are not admin. You cant delete the whole world');
    }

    var donations = Donations.remove({});

    console.log('Deleted donation records', donations);

    var users = Meteor.users.find({_id: { $ne: this.userId }});

    users.forEach(function(user) {

      console.log('Deleting user', user._id);
      Meteor.call('deleteUserById', user._id);

    });

  },

});