if (Meteor.settings.fundraiser.enable === true) {

  Meteor.methods({

    apiGoal: function() {
      var end = moment(Meteor.settings.fundraiser.endDate);
      var latestFundraiserAnalyticsRecord = Analytics.findOne({datatype: 'fundraiser',}, {sort: {createdAt: -1,},});
      var total = 0;
      var percent = 0;

      if (latestFundraiserAnalyticsRecord) {
        total = latestFundraiserAnalyticsRecord.data.total;
        percent = latestFundraiserAnalyticsRecord.data.percent;
      }

      return {
        'total': total,
        'percent': percent,
        'timeLeft': end.fromNow(),
        'timeLeftValue': end.fromNow(true),
      };

    },

  });

};
