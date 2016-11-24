Meteor.publish('donations', function() {

  if (Roles.userIsInRole(this.userId, ['admin',])) {

    return Donations.find();

  } else {

    this.stop();
    return;

  };

});

Meteor.publish('subscriptions', function() {

  if (Roles.userIsInRole(this.userId, ['admin',])) {

    return Subscriptions.find();

  } else {

    this.stop();
    return;

  };

});

Meteor.publish('userSubscriptions', function() {

  return Subscriptions.find({user: this.userId,});

});

Meteor.publish('users', function() {

  if (Roles.userIsInRole(this.userId, ['admin',])) {

    return Meteor.users.find();

  } else {

    this.stop();
    return;

  };

});