if (Meteor.settings.fundraiser.enable === true) {

  Router.route('/api/goal', function(){
    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");
    this.response.setHeader("Access-Control-Allow-Origin", "*");
    this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    this.response.end(JSON.stringify(
      Meteor.call('apiGoal')
    ));
  }, {where: 'server',});

}

Router.route('/api/stripeWebhook', function(event){
  const { body } = event;

  console.log('WEBHOOK INVOKED');

  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  this.response.end(JSON.stringify({})); // Send a response back to Stripe. This info can be seen in the Events history

  // DO SOMETHING HERE
}, {where: 'server',});
