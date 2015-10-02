Accounts.emailTemplates.siteName = 'Novara Media Donation Processing';
Accounts.emailTemplates.from = 'Novara Media Donation Processing <donations@novaramedia.com>';

Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return 'Thank you for your subscription to Novara Media';
};

Accounts.emailTemplates.enrollAccount.text = function (user, url) {
  return 'Thank you for choosing to support Novara Media over the longer term by becoming a subscriber. ' +
    'Your support will be crucial in helping us to expand the project and help it to reach its potential.' +
    '\n\n' +
    'Stay in touch with us on Facebook, Twitter and YouTube and why not share your support for the project during October using the hashtag #Novara10k. ' +
    'In addition to that why not email support.novaramedia.com to five friends. ' +
    'Tell them all about the project and ask if they would be interested in supporting us to build a new media for a better politics.' +
    '\n\n' +
    "As a subscriber you will be the first to know about forthcoming NovaraIRL events, so we'll be sure to see you soon." +
    '\n\n' +
    'If you ever need to cancel or change your subscription you will need to login to your profile. Clicking this link will allow you to set a password for your account: ' +
    url +
    '\n\n' +
    'You can login at http://payment.novaramedia.com/login and find your profile at http://payment.novaramedia.com/profile From there you can cancel or edit your subscription.' +
    '\n\n' +
    'Regards, Novara Media';

};