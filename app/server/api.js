if (Meteor.settings.fundraiser.enable === true) {

  Router.route('/api/goal', function(){
    this.response.statusCode = 200;
    this.response.setHeader('Content-Type', 'application/json');
    this.response.setHeader('Access-Control-Allow-Origin', '*');
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.response.end(JSON.stringify(
      Meteor.call('apiGoal')
    ));
  }, {where: 'server',});

}

Router.route('/api/stripeWebhook', function(event) {
  const { headers, body } = event;

  //>>> Logging for dev

  console.log('WEBHOOK INVOKED');
  console.log('headers', headers);
  console.log('body', body);

  //>>> Return 200 to Stripe to acnoledge reciept

  this.response.statusCode = 200;
  this.response.setHeader('Content-Type', 'application/json');
  this.response.setHeader('Access-Control-Allow-Origin', '*');
  this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  this.response.end(); // Send a response back to Stripe. This info can be seen in the Events history

  //>>> TODO: Call stripe.webhooks.constructEvent with body, headers.stripe-signature & Meteor.settings.stripe.endpointSecret to verify event is from Stripe. Use returned event as data for switch below

  var event = Meteor.call('stripeConstructEvent', JSON.stringify(body), headers['stripe-signature'], Meteor.settings.stripe.endpointSecret);

  if (!event) {
    throw new Meteor.Error('stripe-construct-event-failed', 'Sorry Stripe failed to construct the event.');
  }

  console.log(event);

  //>>> Switch event type for different handling

  switch(body.type) {
    case 'customer.subscription.updated':
      console.log('sub updated');
      break;
    case 'customer.subscription.deleted':
      console.log('sub deleted');
      break;
    default:
      return;
  }

}, {where: 'server',});
