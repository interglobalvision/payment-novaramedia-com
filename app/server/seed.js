if (Meteor.users.find().count() === 0) {

  Accounts.createUser({
    username: 'admin',
    email: Meteor.settings.admin_email,
    password: Meteor.settings.admin_password,
  });

  var admin = Accounts.findUserByEmail(Meteor.settings.admin_email);

  Roles.addUsersToRoles(admin._id, ['admin',]);

}