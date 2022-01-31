const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  "274400873830-4ka809u1fiefvp22s2pgle18ouv5ld14.apps.googleusercontent.com", // ClientID
  "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", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: "1//04fAoEIxmGgMACgYIARAAGAQSNwF-L9IreqsZ5cKj98WbL9lvjdKbMq54xiL80ffsQJJfm_JIZbJXUtuCFMwxSGje6EI2xs2hVuY"
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
       type: "OAuth2",
       user: "info@finanservs.com", 
       clientId: "274400873830-4ka809u1fiefvp22s2pgle18ouv5ld14.apps.googleusercontent.com",
       clientSecret: "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",
       refreshToken: "1//04fAoEIxmGgMACgYIARAAGAQSNwF-L9IreqsZ5cKj98WbL9lvjdKbMq54xiL80ffsQJJfm_JIZbJXUtuCFMwxSGje6EI2xs2hVuY",
       accessToken: accessToken
  }
});

tls: {
  rejectUnauthorized: false
}

const mailOptions = {
  from: "info@finanservs.com",
  to: "leonellrodriguez@gmail.com",
  subject: "Node.js Email with Secure OAuth",
  generateTextFromHTML: true,
  html: "<b>test 111111111111111111</b>"
};

smtpTransport.sendMail(mailOptions, (error, response) => {
  error ? console.log(error) : console.log(response);
  smtpTransport.close();
});
