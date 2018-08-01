import bodyParser from 'body-parser';

Picker.middleware(bodyParser.raw({type: '*/*'}));

Picker.route('/api/stripewebhook', function(params, request, response, next) {
  console.log('WEBHOOK INVOKED');

  let signature = request.headers['stripe-signature'];

/*
  console.log('signature', signature);
  console.log('request.body', request.body);
*/

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-requestuested-With, Content-Type, Accept');
  response.end();

  var event = Meteor.call('stripeConstructEvent', request.body, signature, Meteor.settings.stripe.endpointSecret);

  if (!event) {
    throw new Meteor.Error('stripe-construct-event-failed', 'Sorry Stripe failed to construct the event.');
  }

  console.warn('error', event);
});