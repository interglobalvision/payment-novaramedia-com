Template.admin.events({
  'click .nuclear': function() {

    if (confirm('Are you really sure!!! This erases everything. You only want to do this when moving from dev to live keys')) {

      if (confirm('Last chance to stop mutually assured destruction?')) {

        Meteor.call('nuclear', function(err, result) {
          if (err) {
            console.log(err);
            Alerta.error(err.reason);
          } else {
            Alerta.message('Damn you really did this! That better be correct');
          }
        });

      }

    }

  },

});