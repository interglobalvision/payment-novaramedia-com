Accounts.emailTemplates.siteName = 'Novara Media Donation Processing';
Accounts.emailTemplates.from = 'Novara Media Donation Processing <donations@novaramedia.com>';

Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return 'Thank you for your subscription to Novara Media';
};

Accounts.emailTemplates.enrollAccount.text = function (user, url) {
  return Meteor.settings.public.copy.email.signup +
    '\n\n' +
    'If you ever need to cancel or change your subscription you will need to login to your profile. Clicking this link will allow you to set a password for your account: ' +
    url +
    '\n\n' +
    'You can login at http://payment.novaramedia.com/login and find your profile at http://payment.novaramedia.com/profile From there you can cancel or edit your subscription.' +
    '\n\n' +
    'Regards, Novara Media';
};