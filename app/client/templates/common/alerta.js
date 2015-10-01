Template.alerta.onRendered(function() {
  var _this = this;
  var holder = _this.$('#alerta-holder');
  var messagesDiv = _this.$('#alerta-messages');
  var timeout = 0;

  _this.autorun(function() {

    if (Session.get('alerta')) {

      messagesDiv.html(Session.get('alerta'));
      holder.slideDown();
      $('html, body').animate({scrollTop: 0,});

      Meteor.clearTimeout(timeout);

      timeout = Meteor.setTimeout(function() {

        holder.slideUp();
        Session.set('alerta', null);

      }, 3500);

    }

  });
});