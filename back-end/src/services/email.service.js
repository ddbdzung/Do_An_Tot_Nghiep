const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const billMailer = require('../common/billMailer');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() =>
      logger.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
      ),
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html = `<html></html>`) => {
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};

/**
 * Send an email
 * @param {string} to
 * @param {string} password
 * @returns {Promise}
 */
const sendPasswordEmailWhenCreate = async (to, user, password) => {
  const subject = `Well come to ${config.url}`;
  const text = `Dear ${user.name}!,
  The passworld off account is ${password}, please change passworld after login.
  To login clock on this link: ${config.url}/auth/login`;
  await sendEmail(to, subject, text);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.url}/auth/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send billing email after create transaction
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendBillingEmail = async (
  to,
  transactionDocument,
  serializedProductsInTransaction,
) => {
  const subject = 'Bill';
  const text = `Dear ${transactionDocument?.customerInfo?.name},
  Your order has been created, please check the bill in the content below.
  Thank you for using our service.`;
  const html = billMailer(transactionDocument, serializedProductsInTransaction);
  await sendEmail(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendPasswordEmailWhenCreate,
  sendBillingEmail,
};
