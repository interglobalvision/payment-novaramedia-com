import stripePackage from 'stripe';
const stripe = stripePackage(Meteor.settings.stripe.secret);

var syncChargesCreate = Meteor.wrapAsync(stripe.charges.create, stripe.charges);

var syncCustomersCreate = Meteor.wrapAsync(stripe.customers.create, stripe.customers);
var syncCustomersDelete = Meteor.wrapAsync(stripe.customers.del, stripe.customers);

var syncSubscriptionsCreate = Meteor.wrapAsync(stripe.customers.createSubscription, stripe.customers);
var syncSubscriptionsUpdate = Meteor.wrapAsync(stripe.customers.updateSubscription, stripe.customers);
var syncSubscriptionsCancel = Meteor.wrapAsync(stripe.customers.cancelSubscription, stripe.customers);

var syncCustomerRetrieve = Meteor.wrapAsync(stripe.customers.retrieve, stripe.customers);
var syncCardRetrieve = Meteor.wrapAsync(stripe.customers.retrieveCard, stripe.customers);

Meteor.methods({

  stripeCreateCharge: function(source, amount) {
    check(source, String);
    check(amount, Number);

    console.log(source);
    console.log(amount);

    var charge;

    try {
      charge = syncChargesCreate({
        amount: (amount * 100),
        currency: 'gbp',
        source: source,
        description: 'Donation to Novara Media',
      });

    } catch(error) {
/*
      console.log('stripe charge create error:', error.type);
      console.log('stripe charge create error:', error.message);
*/
      throw new Meteor.Error('stripe-charge-creation-failed', 'Sorry stripe failed to create the charge. This was because: ' + error.message);
    }

//     console.log('New stripe charge:', charge);

    return charge;

  },

  // SUBSCRIPTIONS

  stripeCreateSubscription: function(stripeCustomerId, amount) {
    check(stripeCustomerId, String);
    check(amount, Number);

    try {

      var stripeSubscription = syncSubscriptionsCreate(stripeCustomerId ,{
        plan: 'novarasub',
        quantity: amount,
      });

    } catch(error) {
/*
      console.log('stripe subscription create error:', error.type);
      console.log('stripe subscription create error:', error.message);
*/
      throw new Meteor.Error('stripe-subscription-creation-failed', 'Sorry stripe failed to create the subscription. This was because: ' + error.message);
    }

//     console.log('New stripe subscription', stripeSubscription);

    return stripeSubscription;

  },

  stripeUpdateSubscription: function(stripeCustomerId, stripeSubscriptionId, amount) {
    check(stripeCustomerId, String);
    check(stripeSubscriptionId, String);
    check(amount, Number);

    try {
      var stripeUpdateSubscription = syncSubscriptionsUpdate(stripeCustomerId ,stripeSubscriptionId, {
        quantity: amount,
      });
    } catch(error) {
/*
      console.log('stripe subscription update error:', error.type);
      console.log('stripe subscription update error:', error.message);
*/
      throw new Meteor.Error('stripe-subscription-update-failed', 'Sorry stripe failed to edit the subscription. This was because: ' + error.message);
    }

    return stripeUpdateSubscription;

  },

  stripeCancelSubscription: function(stripeCustomerId, stripeSubscriptionId) {
    check(stripeCustomerId, String);
    check(stripeSubscriptionId, String);

    try {
      var stripeCancelSubscription = syncSubscriptionsCancel(stripeCustomerId ,stripeSubscriptionId);
    } catch(error) {
/*
      console.log('stripe subscription cancel error:', error.type);
      console.log('stripe subscription cancel error:', error.message);
*/
      throw new Meteor.Error('stripe-subscription-cancel-failed', 'Sorry stripe failed to cancel the subscription. This was because: ' + error.message);
    }

    return stripeCancelSubscription;

  },

  // CUSTOMERS

  stripeCreateCustomer: function(source, email) {
    check(source, String);
    check(email, String);

    try {

      var stripeCustomer = syncCustomersCreate({
        source: source,
        email: email,
      });

    } catch(error) {
/*
      console.log('stripe customer create error:', error.type);
      console.log('stripe customer create error:', error.message);
*/
      throw new Meteor.Error('stripe-account-creation-failed', 'Sorry stripe failed to create a user account. This was because: ' + error.message);
    }

//     console.log('New stripe customer', stripeCustomer);

    return stripeCustomer;

  },

  stripeCheckCustomer: function(stripeCustomerId) {
    check(stripeCustomerId, String);

    try {

      var stripeCustomer = syncCustomerRetrieve(stripeCustomerId);

    } catch(error) {
      console.log('stripe customer check error:', error.type);
      console.log('stripe customer check error:', error.message);
      throw new Meteor.Error('stripe-account-check-failed', 'Sorry stripe failed to check the user account. This was because: ' + error.message);
    }

    return stripeCustomer;

  },

  stripeDeleteCustomer: function(stripeCustomerId) {
    check(stripeCustomerId, String);

    try {
      var stripeDeleteCustomer = syncCustomersDelete(stripeCustomerId);
    } catch(error) {
/*
      console.log('stripe customer delete error:', error.type);
      console.log('stripe customer delete error:', error.message);
*/
      throw new Meteor.Error('stripe-customer-delete-failed', 'Sorry stripe failed to delete the customer. This was because: ' + error.message);
    }

//     console.log('Deleted customer:', stripeDeleteCustomer);

    return stripeDeleteCustomer;

  },

});