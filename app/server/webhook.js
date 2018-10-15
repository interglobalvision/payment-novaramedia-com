import bodyParser from 'body-parser';

import { sendErrorEmail } from '../imports/email/errorEmails.js';

Picker.middleware(bodyParser.json());

Picker.route('/api/stripewebhook', function(params, request, response, next) {
  const webhookId = request.body.id;

  // Return 200 to Stripe so it knows we got the message
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-requestuested-With, Content-Type, Accept');
  response.end();

  check(webhookId, String);

  // If we find the event ID in the db then we have already processed it.
  if (!WebhookEvents.findOne(webhookId)) {
    // Get the event from the Stripe API via the ID. This way we confirm the data directly
    const event = Meteor.call('stripeRetriveEvent', webhookId);

    if (!event) {
      throw new Meteor.Error('stripe-retrive-event-failed', 'Sorry Stripe failed to retrive the event.');
    }

//     console.log(event);

    // Handle different webhook event types here
    switch(event.type) {
      case 'invoice.payment_failed':
        handleWebhookInvoicePaymentFailed(event);
        break;
      case 'customer.subscription.created':
        console.log('Good news: a new subscription worth £' + event.data.object.quantity);
        break;
    }

    return WebhookEvents.insert({_id: event.id});
  }
});

// Webhook event handler functions. These probably should go somewhere more sensible?

handleWebhookInvoicePaymentFailed = (event) => {
  console.log('***Invoice payment failed***');

//   console.log('event:', event);

  const data = event.data.object;
  // we need this to find our local data
  const stripeSubscriptionId = data.subscription;
  // we need this to check the progress of the failure
  const nextPaymentAttempt = data.next_payment_attempt;

  // get local subscription record
  const localSubscription = Subscriptions.findOne({
    stripeId: stripeSubscriptionId,
  });

  if (!localSubscription) {
    // handle error here: if there is a Stripe subscription with no associated local subscription this is an error level that requires human investigation.
    sendErrorEmail('No local subscription found when handling an invoice payment failure webhook.', {eventData: data, stripeSubscriptionId: stripeSubscriptionId});
    return console.log('No local subscription found');
  }

  // get user associated with subscription record
  const localUser = Meteor.users.findOne(localSubscription.user);

  if (!localUser) {
    // handle error here: if there is a Stripe subscription with no associated local user this is an error level that requires human investigation.
    sendErrorEmail('No local user account found when handling an invoice payment failure webhook.', {eventData: data, localSubscription: localSubscription});
    return console.log('No local user found');
  }

  if (nextPaymentAttempt === null) {
    // null next attempt means that was the last attempt. (at this moment do we delete the subscription? or do we only delete the sub from that webhook event?)

    // action: delete subscription from stripe and also locally.
    const cancelledStripeSubscription = Meteor.call('stripeCancelSubscription', localUser.profile.stripeCustomer, stripeSubscriptionId);

    console.log('cancelledStripeSubscription', cancelledStripeSubscription);

    if (!cancelledStripeSubscription) {
      // handle error: no sub was cancelled for some reason.
      sendErrorEmail('Stripe subscription accociated with a final attempted invoice failed to be deleted. This happened while handling an invoice payment failure webhook', {eventData: data, localSubscription: localSubscription, stripeSubscriptionId: stripeSubscriptionId});
    }

    const cancelledLocalSubscription = Subscriptions.remove(localSubscription._id);

    console.log('cancelledLocalSubscription', cancelledLocalSubscription);

    if (!cancelledStripeSubscription) {
      // handle error: no sub was cancelled for some reason.
      sendErrorEmail('Local subscription subscription accociated with a final attempted invoice failed to be deleted. The Stripe partner to this subscription has already been deleted. This happened while handling an invoice payment failure webhook', {eventData: data, localSubscription: localSubscription, stripeSubscriptionId: stripeSubscriptionId});
    }

    // action: email user to inform them their account has expired with instructions on how to create a new subscription
    console.log('email user to inform them their subscription has expired with instructions on how to create a new subscription');

  } else {
    const nextPaymentAttemptMoment = moment(nextPaymentAttempt, 'X');
    // next payment attempt is in the future
    console.log('nextPaymentAttempt', nextPaymentAttempt);
    console.log('next payment attempt is', nextPaymentAttemptMoment.fromNow());
    // action: email user to inform them of failed charge and tell them to sort out the issue
    console.log('email user to inform them of failed charge and tell them to sort out the issue');
  }

}