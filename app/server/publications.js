/* ---------------------------------------------------- +/

## Publications ##

All publications-related code.

/+ ---------------------------------------------------- */

Meteor.publish('donations', function() {

  if (Roles.userIsInRole(this.userId, ['admin'])) {

    return Donations.find();

  } else {

    this.stop();
    return;

  };

});

Meteor.publish('subscriptions', function() {

  if (Roles.userIsInRole(this.userId, ['admin'])) {

    return Subscriptions.find();

  } else {

    this.stop();
    return;

  };

});