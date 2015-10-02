var Stripe = StripeAPI(Meteor.settings.stripe.secret);

var syncChargesCreate = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);

var syncCustomersCreate = Meteor.wrapAsync(Stripe.customers.create, Stripe.customers);
var syncCustomersDelete = Meteor.wrapAsync(Stripe.customers.del, Stripe.customers);

var syncSubscriptionsCreate = Meteor.wrapAsync(Stripe.customers.createSubscription, Stripe.customers);
var syncSubscriptionsUpdate = Meteor.wrapAsync(Stripe.customers.updateSubscription, Stripe.customers);
var syncSubscriptionsCancel = Meteor.wrapAsync(Stripe.customers.cancelSubscription, Stripe.customers);

Meteor.methods({

  stripeCreateCharge: function(source, amount) {
    check(source, String);
    check(amount, Number);

    console.log(source);
    console.log(amount);

    try {
      var charge = syncChargesCreate({
        amount: (amount * 100),
        currency: 'gbp',
        source: source,
        description: 'Donation to Novara Media',
      });

    } catch(error) {
/*
      console.log('Stripe charge create error:', error.type);
      console.log('Stripe charge create error:', error.message);
*/
      throw new Meteor.Error('stripe-charge-creation-failed', 'Sorry Stripe failed to create the charge. This was because: ' + error.message);
    }

//     console.log('New Stripe charge:', charge);

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
      console.log('Stripe subscription create error:', error.type);
      console.log('Stripe subscription create error:', error.message);
*/
      throw new Meteor.Error('stripe-subscription-creation-failed', 'Sorry Stripe failed to create the subscription. This was because: ' + error.message);
    }

//     console.log('New Stripe subscription', stripeSubscription);

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
      console.log('Stripe subscription update error:', error.type);
      console.log('Stripe subscription update error:', error.message);
*/
      throw new Meteor.Error('stripe-subscription-update-failed', 'Sorry Stripe failed to edit the subscription. This was because: ' + error.message);
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
      console.log('Stripe subscription cancel error:', error.type);
      console.log('Stripe subscription cancel error:', error.message);
*/
      throw new Meteor.Error('stripe-subscription-cancel-failed', 'Sorry Stripe failed to cancel the subscription. This was because: ' + error.message);
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
      console.log('Stripe customer create error:', error.type);
      console.log('Stripe customer create error:', error.message);
*/
      throw new Meteor.Error('stripe-account-creation-failed', 'Sorry Stripe failed to create a user account. This was because: ' + error.message);
    }

//     console.log('New Stripe customer', stripeCustomer);

    return stripeCustomer;

  },

  stripeDeleteCustomer: function(stripeCustomerId) {
    check(stripeCustomerId, String);

    try {
      var stripeDeleteCustomer = syncCustomersDelete(stripeCustomerId);
    } catch(error) {
/*
      console.log('Stripe customer delete error:', error.type);
      console.log('Stripe customer delete error:', error.message);
*/
      throw new Meteor.Error('stripe-customer-delete-failed', 'Sorry Stripe failed to delete the customer. This was because: ' + error.message);
    }

//     console.log('Deleted customer:', stripeDeleteCustomer);

    return stripeDeleteCustomer;

  },
});