import bodyParser from 'body-parser';

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

    // Handle different webhook event types here
    switch(event.type) {
      case 'customer.subscription.created':
        console.log('Good news: a new subscription worth £' + event.data.object.quantity);
        break;
    }

    return WebhookEvents.insert({_id: event.id});
  }
});