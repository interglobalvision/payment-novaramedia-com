Template.tools.onRendered(function() {
  var unsubscribers = Meteor.users.find({}).fetch().filter(function(user) {

    // Check if is admin type user
    if (Roles.userIsInRole(user._id, 'admin')) {
      return false;
    }

    // Check if user has a subscription
    var userSubscription = Subscriptions.findOne({user: user._id});

    if (userSubscription) {
      return false;
    }

    return true;
  });

  _.each(unsubscribers, function(user) {
    $('#readout-unsubscribers').prepend('<div>Unsubscriber: ' + user.emails[0].address + '</div>');
  });

  $('#readout-unsubscribers').prepend('<div>Found ' + unsubscribers.length + ' unsubscribers to delete</div>');

  this.unsubscribers = new ReactiveVar();
  this.unsubscribers.set(unsubscribers);

});

Template.tools.events({
  'click #tool-prune-unsubscribers': function(event) {
    const template = Template.instance();
    const unsubscribers = template.unsubscribers.get();

    if (confirm('Are you sure you want to delete these ' + unsubscribers.length + ' users?')) {
      _.each(unsubscribers, function(user) {
        return Meteor.call('deleteUserById', user._id, function(err, response) {

          if (err) {
            console.log(err);
            Alerta.error(err.reason);
          } else {
            Alerta.message('User ' + user._id + ' Deleted');
          }

        });
      });
    }
  },
});