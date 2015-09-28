/* ---------------------------------------------------- +/

## Handlebars Helpers ##

Custom Handlebars helpers.

/+ ---------------------------------------------------- */

Handlebars.registerHelper('donationsTotal', function() {

  var donationsTotal = 0;
  var donations = Donations.find();

  donations.forEach(function(donations) {
    donationsTotal += donations.amount;
  });

  return donationsTotal;
});

Handlebars.registerHelper('subscriptionsTotal', function() {

  return '';
});

Handlebars.registerHelper('timeSince', function(date) {

  return moment(date).fromNow();

});