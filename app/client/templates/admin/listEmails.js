Template.listEmails.onCreated(function() {
//   console.log(this);
});

Template.listEmails.events({
  'click .email-export' (event) {
//     console.log(event);
    selectText($(event.currentTarget));
  },
});

Template.listEmails.helpers({
  expiredUsers: function () {

    var expiredUsers = Meteor.users.find({}).fetch().filter(function (doc) {
      var userSubscription = Subscriptions.findOne({user: doc._id});

      if (userSubscription) {
        return false;
      } else {
        return true;
      }
    });

    var expiredUsersIds = _.pluck(expiredUsers, '_id');

    return Meteor.users.find({_id: {$in: expiredUsersIds}});
  },
});

function selectText($item) {
  var doc = document;
  var element = $item[0];
  var range;
  var selection;

  if (doc.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(element);
    range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}