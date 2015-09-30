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
    except: ['login','forgot','homepage','oneoff','subscription','root','thanks','faq',],
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

  this.route('oneoff', {
    data: function () {
      return this.params.query;
    },
  });

  this.route('subscription', {
    data: function () {
      return this.params.query;
    },
  });

  this.route('thanks');

  this.route('faq');

});
