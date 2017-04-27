if (Meteor.settings.goal.enableApi === true) {

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