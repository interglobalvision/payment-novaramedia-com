import { Email } from 'meteor/email';

export const sendErrorEmail = (errorDescription, errorData) => {
  Email.send({
    to: Meteor.settings.admin_email,
    from: Meteor.settings.admin_email,
    subject: process.env.ROOT_URL + ' error alert',
    text: 'An error requires human investigation\n\n' + errorDescription + '\n\n' + JSON.stringify(errorData),
  });
}