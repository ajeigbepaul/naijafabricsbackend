// const image = require('./legumes.jpg')
const nodemailer = require("nodemailer");
const config = process.env;
// const path = require('path');
const smtpTransport = require('nodemailer-smtp-transport');

// const hbs = require('nodemailer-express-handlebars')





exports.sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: config.SERVICE,
    
      secure: true,
      auth: {
        // user: config.USER,
        pass: config.PASSMAILER,
        user: "pdave4krist@gmail.com",
      },
    });
      await transporter.sendMail({
      from: config.MAIL_FROM,
      to: email,
      subject,
      text
      // `Dear agent Your account has been succesfully created, go to the farms agora web/mobile app to login to your dashboard or you can click the link 'https://farmsagora-app.herokuapp.com/agent' . Here are your login details ${text} , do well to change this password from your dashboard`,
    });
  console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};




//////////////////////////////////////////////////////////////////

exports.testEmail = async (email, subject, text, defaultPass) => {
  try {
    //defaultPass which is generated dynamic upon account creation
    const transporter = nodemailer.createTransport(smtpTransport({
      // service: config.SERV,
      host: 'smtp.bamwholesalestores.com',
      port: 993,
      secure: false,
      auth: {
        // user: config.USER,
        user: "users@farmsagora.com",
        pass: config.PASSMAILER,
        // pass: "AYMot37tUk",
      },
    }));


    // await transporter.use('compile', hbs({
    //   viewEngine: 'express-handlebars',
    //   viewPath: './views/index.handlebars'
    // }))

    await transporter.sendMail({
      from: config.MAIL_FROM,
      to: email,
      subject: subject,
      // text: ` Your account has been succesfully created, please  click the link 'https://farmsagora-app/setup/cooperative' to  login with your email and password ${defaultPass} to login to your dashboard `,
      html: '<b> Coopertive User </b></br><p>Your account has been succesfully created, please  click the link "https://farmsagora-app/setup/cooperative" to  login with your email and password ${defaultPass} to login to your dashboard</p> ',
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};


// module.exports = sendEmail;
