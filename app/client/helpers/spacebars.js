/* ---------------------------------------------------- +/

## Handlebars Helpers ##

Custom Handlebars helpers.

/+ ---------------------------------------------------- */

// Returns a from now string from a data object
Handlebars.registerHelper('timeSince', function(date) {
  return moment(date).fromNow();
});

// Returns the count of a collection
Handlebars.registerHelper('displayCount', function(cursor) {
  return cursor.count();
});

// Returns the string of the first email associated with a user account
Handlebars.registerHelper('displayEmail', function(userId) {
  var user = Meteor.users.findOne(userId);

  return user.emails[0].address;
});