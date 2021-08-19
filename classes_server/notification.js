const { json } = require('express');
//const nodemailer = require('nodemailer');
const logger = require('../logger');

class Notification{
 
    async sendEmail(to, subject, html){

        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.EMAIL_API);
        const msg = {
          to, 
          from: MYMAIL,
          subject,
          html,
        }
        sgMail
          .send(msg) 
          .then(() => {
            console.log('Email sent')
          })
          .catch((error) => {
            console.error(error)
          })
     }
} 
     
module.exports = Notification; 