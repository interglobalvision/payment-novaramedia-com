/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// Config

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

// On before

Router.onBeforeAction(function () {
    if (!Meteor.userId()) {
      this.render('login');
    } else {
      this.next();
    }
  },

  {
    except: ['login','homepage','oneoff','subscription','root',],
  }
);

// Routes

Router.map(function() {

  this.route('/', {
    name: 'root',
    onBeforeAction: function () {

      if (!Meteor.userId()) {
        this.redirect('oneoff');
      } else {
        this.redirect('profile');
      }

    },
  });

  this.route('oneoff');

  this.route('subscription');

});
