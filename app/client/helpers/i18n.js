getUserLanguage = function () {
  // Put here the logic for determining the user language
  return 'en';
};

Meteor.startup(function () {
//   Session.set("showLoadingIndicator", true);

  TAPi18n.setLanguage(getUserLanguage())
    .done(function () {
//       Session.set("showLoadingIndicator", false);
    })
    .fail(function (errorMessage) {
      // Handle the situation
      console.log(errorMessage);
    });
});