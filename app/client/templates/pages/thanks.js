Template.thanks.helpers({
  copyFromSettings: function() {
    return '<p><h3>' + Meteor.settings.public.copy.thanks.paragraphOne + '</h3></p><p><h3>' + Meteor.settings.public.copy.thanks.paragraphTwo + '</h3></p>';
  }
});