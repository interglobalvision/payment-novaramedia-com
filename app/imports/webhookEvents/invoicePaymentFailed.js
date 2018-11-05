import { sendErrorEmail } from '../email/errorEmails.js';

export const invoicePaymentFailed = (event) => {
  console.log('***Invoice payment failed***');

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
    return console.log('No local subscription found when handling an invoice payment failure webhook. Stripe subscription ID:', stripeSubscriptionId);
  }

  // get user associated with subscription record
  const localUser = Meteor.users.findOne(localSubscription.user);

  if (!localUser) {
    // handle error here: if there is a Stripe subscription with no associated local user this is an error level that requires human investigation.
    sendErrorEmail('No local user account found when handling an invoice payment failure webhook.', {eventData: data, localSubscription: localSubscription});
    return console.log('No local user account found when handling an invoice payment failure webhook. User ID:', localSubscription.user);
  }

  if (nextPaymentAttempt === null) {
    // null next attempt means that was the last attempt

    // action: delete subscription from stripe and also locally.
    const cancelledStripeSubscription = Meteor.call('stripeCancelSubscription', localUser.profile.stripeCustomer, stripeSubscriptionId);

    if (!cancelledStripeSubscription) {
      // handle error: no sub was cancelled for some reason.
      sendErrorEmail('Stripe subscription accociated with a final attempted invoice failed to be deleted. This happened while handling an invoice payment failure webhook', {eventData: data, localSubscription: localSubscription, stripeSubscriptionId: stripeSubscriptionId});
    }

    const cancelledLocalSubscription = Subscriptions.remove(localSubscription._id);

    if (!cancelledStripeSubscription) {
      // handle error: no sub was cancelled for some reason.
      sendErrorEmail('Local subscription subscription accociated with a final attempted invoice failed to be deleted. The Stripe partner to this subscription has already been deleted. This happened while handling an invoice payment failure webhook', {eventData: data, localSubscription: localSubscription, stripeSubscriptionId: stripeSubscriptionId});
    }

    // action: email user to inform them their account has expired with instructions on how to create a new subscription
    console.log('email user to inform them their subscription has expired with instructions on how to create a new subscription');

  } else {
    const nextPaymentAttemptMoment = moment(nextPaymentAttempt, 'X');
    // next payment attempt is in the future
    // console.log('nextPaymentAttempt', nextPaymentAttempt);
    // console.log('next payment attempt is', nextPaymentAttemptMoment.fromNow());
    // action: email user to inform them of failed charge and tell them to sort out the issue
    console.log('email user to inform them of failed charge and tell them to sort out the issue');
  }

}