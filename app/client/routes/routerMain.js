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

/*

  this.route('items', {
    waitOn: function () {
      return Meteor.subscribe('allItems');
    },
    data: function () {
      return {
        items: Items.find()
      }
    }
  });

  this.route('item', {
    path: '/items/:_id',
    waitOn: function () {
      return Meteor.subscribe('singleItem', this.params._id);
    },
    data: function () {
      return {
        item: Items.findOne(this.params._id)
      }
    }
  });
*/

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
