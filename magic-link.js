'use latest'

import express from 'express'
import { fromExpress } from 'webtask-tools'
import bodyParser from 'body-parser'

const nodemailer = require('nodemailer')
const app = express()

app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  const { WEBSITE_URL } = req.webtaskContext.data

  const HTML = renderView({
    website_url: WEBSITE_URL,
    subscriber: {
      token: '1bf67',
      id: '123'
    }
  })

  res.set('Content-Type', 'text/html')
  res.status(200).send(HTML)
})

app.post('/', (req, res, next) => {
  const { WEBSITE_URL, EMAIL_FROM, SES_API_KEY, SES_API_SECRET } = req.webtaskContext.data
  const { id, email, token } = req.body

  if (!email || !id || !token) {
    return next(new Error('Required parameters missing [email, token, id].'))
  }

  const HTML = renderView({
    website_url: WEBSITE_URL,
    magic_link: generateMagicLink(WEBSITE_URL, token),
    subscriber: {
      id,
      email,
      token
    }
  })

  let transporter = createTransporter(SES_API_KEY, SES_API_SECRET)

  transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: 'The Press Review - Your login link',
    text: `Your login link: ${generateMagicLink(WEBSITE_URL, token)}`,
    html: HTML
  }, function (err, result) {
    if (err) {
      res.status(500).json({error: 'Email has not been sent', message: err})
    } else {
      res.status(200).json({success: true})
    }
  })
})

module.exports = fromExpress(app)

function generateMagicLink (websiteUrl, token) {
  return `${websiteUrl}/auth?token=${token}`
}

function createTransporter (apiKey, apiSecret) {
  return nodemailer.createTransport({
    transport: 'ses',
    accessKeyId: apiKey,
    secretAccessKey: apiSecret
  })
}

function renderHead () {
  return `
    <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
      <meta content="width=device-width" name="viewport">
      <meta content="telephone=no" name="format-detection">
      <title>The Press Review</title>

      <style data-premailer="ignore" type="text/css">
        #outlook a {
          padding: 0;
        }

        body {
          -webkit-text-size-adjust: none;
          -ms-text-size-adjust: none;
          font-weight: 400;
          margin: 0;
          padding: 0;
        }

        .ReadMsgBody {
          width: 100%;
        }

        .ExternalClass {
          width: 100%;
        }

        img {
          border: 0;
          max-width: 100%;
          height: auto;
          outline: none;
          display: inline-block;
          margin: 0;
          padding: 0;
          text-decoration: none;
          line-height: 100%;
        }

        #backgroundTable {
          height: 100% !important;
          margin: 0;
          padding: 0;
          width: 100% !important;
        }
      </style>

      <style type="text/css">
        /**
         * Generic
         */

        .main {
          font-family: HelveticaNeue, Helvetica, Arial, sans-serif;
          letter-spacing: 0;
        }

        .main .main-td {
          padding: 30px 35px 40px;
          border-radius: 2px;
        }

        .main-td {
          box-shadow: 0 2px 48px 0 rgba(0, 0, 0, 0.1);
        }

        table {
          border-spacing: 0;
          border-collapse: separate;
          table-layout: fixed;
        }

        td {
          font-size: 16px;
          padding: 0;
          font-family: Helvetica, Arial, sans-serif;
        }

        a {
          border: none;
          outline: none !important;
        }

        /**
         * Header
         */

        .header td img {
          padding: 15px 0 30px;
          text-align: left;
        }

        .header .logo {
          text-align: left;
        }

        /**
         * Content
         */

        .content-td {
          font-size: 14px;
          line-height: 22px;
          padding: 0;
          color: #333333;
        }

        .content-td> :first-child {
          margin-top: 0;
        }

        .content-td h1 {
          font-size: 26px;
          line-height: 33px;
          color: #282F33;
          margin-bottom: 7px;
          margin-top: 30px;
          font-weight: normal;
        }

        .content-td h2 {
          font-size: 18px;
          font-weight: bold;
          color: #282F33;
          margin-top: 30px;
          margin-bottom: 7px;
        }

        .content-td h1+h2 {
          margin-top: 0px !important;
        }

        .content-td h2+h1 {
          margin-top: 0px !important;
        }

        .content-td h3,
        .content-td h4,
        .content-td h5 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .content-td p {
          margin: 0 0 17px 0;
          line-height: 1.5;
        }

        .content-td p img,
        .content-td h1 img,
        .content-td h2 img,
        .content-td li img,
        .content-td .intercom-h2b-button img {
          margin: 0;
          padding: 0;
        }

        .content-td p.intro {
          font-size: 20px;
          line-height: 30px;
        }

        .content-td blockquote {
          margin: 40px 0;
          font-style: italic;
          color: #8C8C8C;
          font-size: 18px;
          text-align: center;
          padding: 0 30px;
          font-family: Georgia, sans-serif;
          quotes: none;
        }

        .content-td blockquote a {
          color: #8C8C8C;
        }

        .content-td ul {
          list-style: disc;
          margin: 0 0 20px 40px;
          padding: 0;
        }

        .content-td ol {
          list-style: decimal;
          margin: 0 0 20px 40px;
          padding: 0;
        }

        .content-td img {
          max-width: 100%;
          margin: 17px 0;
        }

        .content-td .intercom-container {
          margin-bottom: 16px;
        }

        .content-td hr {
          border: none;
          border-top: 1px solid #DDD;
          margin: 50px 30% 50px 30%;
        }

        .content-td table {
          border-collapse: collapse;
          border-spacing: 0;
          margin-bottom: 20px;
        }

        .content-td td,
        .content-td th {
          padding: 5px 7px;
          border: 1px solid #DADADA;
          text-align: left;
          vertical-align: top;
        }

        .content-td th {
          font-weight: bold;
          background: #F6F6F6;
        }

        .content-td a {
          color: #1251BA;
        }

        .content td.content-td table.intercom-container {
          margin: 17px 0;
        }

        .content td.content-td table.intercom-container.intercom-align-center {
          margin-left: auto;
          margin-right: auto;
        }

        .content td.content-td table.intercom-container td {
          background-color: #4F6FFB;
          padding: 12px 35px;
          border-radius: 3px;
          font-family: Helvetica, Arial, sans-serif;
          margin: 0;
          border: none;
        }

        .content td.content-td table.intercom-container .intercom-h2b-button {
          display: inline-block;
          color: white;
          font-weight: bold;
          font-size: 14px;
          text-decoration: none;
          background-color: #4F6FFB;
          border: none !important;
          border-radius: 3px;
        }

        .footer-td {
          text-align: center;
          padding: 21px 30px 15px;
        }

        .footer-td p,
        .footer-td a {
          font-size: 12px;
          color: #b7b7b7;
          text-decoration: none;
          font-weight: 300;
        }

        .footer-td p {
          margin: 0 0 6px 0;
        }

        .footer-td p.address {
          margin-top: 9px;
          line-height: 1.5em;
        }

        .footer-td p.powered-by {
          margin-top: 18px;
        }

        .footer-td p.unsub {
          margin: 0;
        }

        .footer .unsub a {
          text-decoration: underline;
          display: block;
          margin: 12px 0 0;
        }

        p.unsub a {
          text-decoration: underline;
        }

        .footer-td p.powered-by a {
          font-weight: bold;
        }

        .footer-td textarea {
          text-decoration: none;
          font-size: 12px;
          color: #b7b7b7;
          font-family: Helvetica, Arial, sans-serif;
          padding: 9px 0;
          font-weight: 300;
          line-height: normal;
        }

        a.intercom-h2b-button {
          background-color: #4F6FFB;
          font-size: 14px;
          color: #FFF;
          font-weight: bold;
          border-radius: 3px;
          display: inline-block;
          text-decoration: none;
          padding: 12px 35px;
        }
      </style>

      <style data-premailer="ignore" type="text/css">
        @media screen and (max-width: 595px) {
          body {
            padding: 10px !important;
          }
          .main {
            width: 100% !important;
          }
          .main .main-td {
            padding: 20px !important;
          }
          .header td {
            text-align: center;
          }
        }

        .content-td blockquote+* {
          margin-top: 20px !important;
        }

        .ExternalClass .content-td h1 {
          padding: 20px 0 !important;
        }

        .ExternalClass .content-td h2 {
          padding: 0 0 5px !important;
        }

        .ExternalClass .content-td p {
          padding: 10px 0 !important;
        }

        .ExternalClass .content-td .intercom-container {
          padding: 5px 0 !important;
        }

        .ExternalClass .content-td hr+* {
          padding-top: 30px !important;
        }

        .ExternalClass .content-td ol,
        .ExternalClass .content-td ul {
          padding: 0 0 20px 40px !important;
          margin: 0 !important;
        }

        .ExternalClass .content-td ol li,
        .ExternalClass .content-td ul li {
          padding: 3px 0 !important;
          margin: 0 !important;
        }

        .ExternalClass table .footer-td p {
          padding: 0 0 6px 0 !important;
          margin: 0 !important;
        }

        .ExternalClass table .footer-td p.powered-by,
        .ExternalClass table .footer-td p.unsub {
          padding-top: 15px;
        }
      </style>

      <style type="text/css">
        .intercom-align-right {
          text-align: right !important;
        }

        .intercom-align-center {
          text-align: center !important;
        }

        .intercom-align-left {
          text-align: left !important;
        }
        /* Over-ride for RTL */

        .right-to-left .intercom-align-right {
          text-align: left !important;
        }

        .right-to-left .intercom-align-left {
          text-align: right !important;
        }

        .right-to-left .intercom-align-left {
          text-align: right !important;
        }

        .right-to-left li {
          text-align: right !important;
          direction: rtl;
        }

        .right-to-left .intercom-align-left img,
        .right-to-left .intercom-align-left .intercom-h2b-button {
          margin-left: 0 !important;
        }

        .intercom-attachment,
        .intercom-attachments,
        .intercom-attachments td,
        .intercom-attachments th,
        .intercom-attachments tr,
        .intercom-attachments tbody,
        .intercom-attachments .icon,
        .intercom-attachments .icon img {
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .intercom-attachments {
          margin: 10px 0 !important;
        }

        .intercom-attachments .icon,
        .intercom-attachments .icon img {
          width: 16px !important;
          height: 16px !important;
        }

        .intercom-attachments .icon {
          padding-right: 5px !important;
        }

        .intercom-attachment {
          display: inline-block !important;
          margin-bottom: 5px !important;
        }

        .intercom-interblocks-content-card {
          width: 334px !important;
          max-height: 136px !important;
          max-width: 100% !important;
          overflow: hidden !important;
          border-radius: 20px !important;
          font-size: 16px !important;
          border: 1px solid #e0e0e0 !important;
        }

        .intercom-interblocks-link,
        .intercom-interblocks-article-card {
          text-decoration: none !important;
        }

        .intercom-interblocks-article-icon {
          width: 22.5% !important;
          height: 136px !important;
          float: left !important;
          background-color: #fafafa !important;
          background-image: url('https://static.intercom-mail.com/assets/article_book-1a595be287f73c0d02f548f513bfc831.png') !important;
          background-repeat: no-repeat !important;
          background-size: 32px !important;
          background-position: center !important;
        }

        .intercom-interblocks-article-text {
          width: 77.5% !important;
          float: right !important;
          background-color: #fff !important;
        }

        .intercom-interblocks-link-title,
        .intercom-interblocks-article-title {
          color: #519dd4 !important;
          font-size: 15px !important;
          margin: 16px 18px 12px !important;
          line-height: 1.3em !important;
          overflow: hidden !important;
        }

        .intercom-interblocks-link-description,
        .intercom-interblocks-article-body {
          margin: 0 18px 12px !important;
          font-size: 14px !important;
          color: #65757c !important;
          line-height: 1.3em !important;
        }

        .intercom-interblocks-link-author,
        .intercom-interblocks-article-author {
          margin: 10px 15px !important;
          height: 24px !important;
          line-height: normal !important;
        }

        .intercom-interblocks-link-author-avatar,
        .intercom-interblocks-article-author-avatar {
          width: 16px !important;
          height: 16px !important;
          display: inline-block !important;
          vertical-align: middle !important;
          float: left;
          margin-right: 5px;
        }

        .intercom-interblocks-link-author-avatar-image,
        .intercom-interblocks-article-author-avatar-image {
          width: 16px !important;
          height: 16px !important;
          border-radius: 50% !important;
          margin: 0 !important;
          vertical-align: top !important;
          font-size: 12px !important;
        }

        .intercom-interblocks-link-author-name,
        .intercom-interblocks-article-author-name {
          color: #74848b !important;
          margin: 0 0 0 5px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          overflow: hidden !important;
        }

        .intercom-interblocks-article-written-by {
          color: #8897a4 !important;
          margin: 1px 0 0 5px !important;
          font-size: 12px !important;
          overflow: hidden !important;
          vertical-align: middle !important;
          float: left !important;
        }
      </style>
      <style>
        .intercom-align-right {
          text-align: right !important;
        }
        .intercom-align-center {
          text-align: center !important;
        }
        .intercom-align-left {
          text-align: left !important;
        }
        /* Over-ride for RTL */
        .right-to-left .intercom-align-right{
          text-align: left !important;
        }
        .right-to-left .intercom-align-left{
          text-align: right !important;
        }
        .right-to-left .intercom-align-left {
          text-align:right !important;
        }
        .right-to-left li {
          text-align:right !important;
          direction: rtl;
        }
        .right-to-left .intercom-align-left img,
        .right-to-left .intercom-align-left .intercom-h2b-button {
          margin-left: 0 !important;
        }
        .intercom-attachment,
        .intercom-attachments,
        .intercom-attachments td,
        .intercom-attachments th,
        .intercom-attachments tr,
        .intercom-attachments tbody,
        .intercom-attachments .icon,
        .intercom-attachments .icon img {
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .intercom-attachments {
          margin: 10px 0 !important;
        }
        .intercom-attachments .icon,
        .intercom-attachments .icon img {
          width: 16px !important;
          height: 16px !important;
        }
        .intercom-attachments .icon {
          padding-right: 5px !important;
        }
        .intercom-attachment {
          display: inline-block !important;
          margin-bottom: 5px !important;
        }

        .intercom-interblocks-content-card {
          width: 334px !important;
          max-height: 136px !important;
          max-width: 100% !important;
          overflow: hidden !important;
          border-radius: 20px !important;
          font-size: 16px !important;
          border: 1px solid #e0e0e0 !important;
        }

        .intercom-interblocks-link,
        .intercom-interblocks-article-card {
          text-decoration: none !important;
        }

        .intercom-interblocks-article-icon {
          width: 22.5% !important;
          height: 136px !important;
          float: left !important;
          background-color: #fafafa !important;
          background-image: url('https://static.intercom-mail-200.com/assets/article_book-1a595be287f73c0d02f548f513bfc831.png') !important;
          background-repeat: no-repeat !important;
          background-size: 32px !important;
          background-position: center !important;
        }

        .intercom-interblocks-article-text {
          width: 77.5% !important;
          float: right !important;
          background-color: #fff !important;
        }

        .intercom-interblocks-link-title,
        .intercom-interblocks-article-title {
          color: #519dd4 !important;
          font-size: 15px !important;
          margin: 16px 18px 12px !important;
          line-height: 1.3em !important;
          overflow: hidden !important;
        }

        .intercom-interblocks-link-description,
        .intercom-interblocks-article-body {
          margin: 0 18px 12px !important;
          font-size: 14px !important;
          color: #65757c !important;
          line-height: 1.3em !important;
        }

        .intercom-interblocks-link-author,
        .intercom-interblocks-article-author {
          margin: 10px 15px !important;
          height: 24px !important;
          line-height: normal !important;
        }

        .intercom-interblocks-link-author-avatar,
        .intercom-interblocks-article-author-avatar {
          width: 16px !important;
          height: 16px !important;
          display: inline-block !important;
          vertical-align: middle !important;
          float: left;
          margin-right: 5px;
        }

        .intercom-interblocks-link-author-avatar-image,
        .intercom-interblocks-article-author-avatar-image {
          width: 16px !important;
          height: 16px !important;
          border-radius: 50% !important;
          margin: 0 !important;
          vertical-align: top !important;
          font-size: 12px !important;
        }

        .intercom-interblocks-link-author-name,
        .intercom-interblocks-article-author-name {
          color: #74848b !important;
          margin: 0 0 0 5px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          overflow: hidden !important;
        }

        .intercom-interblocks-article-written-by {
          color: #8897a4 !important;
          margin: 1px 0 0 5px !important;
          font-size: 12px !important;
          overflow: hidden !important;
          vertical-align: middle !important;
          float: left !important;
        }
      </style>
    </head>
  `
}

function renderLogo () {
  return `
    <table class="header" style="border-collapse: separate; border-spacing: 0; table-layout: fixed" width="100%">
      <tbody>
        <tr>
          <td align="left" class="logo" style="font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 0; text-align: left">
            <img class="featured" height="25" src="https://s3.amazonaws.com/thepressreview/logos/logo_chat_v2.png" style="padding: 15px 0 30px; text-align: left" width="141">
          </td>
        </tr>
      </tbody>
    </table>
  `
}

function renderFooter (locals) {
  return `
    <table align="middle" class="footer" style="border-collapse: separate; border-spacing: 0; table-layout: fixed" width="100%">
      <tbody>
        <tr>
          <td style="font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 0">
            <table align="center" bgcolor="transparent" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; border-spacing: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; letter-spacing: 0; table-layout: fixed" width="600">
              <tbody>
                <tr>
                  <td align="center" class="footer-td" style="font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 21px 30px 15px; text-align: center">
                    <p style="color: #b7b7b7; font-size: 12px; font-weight: 300; margin: 0 0 6px; text-decoration: none">${locals.website_url}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>  
  `
}

function renderView (locals) {
  return `
    <!DOCTYPE html>
    <html>
      ${renderHead()}
      <body bgcolor="f1f1f1" style="background-color: #f1f1f1; margin: 0px; padding: 20px">
        <table align="center" bgcolor="white" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; border-spacing: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; letter-spacing: 0; table-layout: fixed" width="595">
          <tbody>
            <tr>
              <td class="main-td" style="border-radius: 2px; box-shadow: 0 2px 48px 0 rgba(0, 0, 0, 0.1); font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 30px 35px 40px">
                ${renderLogo()}
                <table class="content" style="border-collapse: separate; border-spacing: 0; table-layout: fixed" width="100%">
                  <tbody>
                    <tr>
                      <td class="content-td" style="color: #333333; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; padding: 0">
                        <p align="left" class="intercom-align-left" style="line-height: 1.5; margin: 0 0 17px; text-align: left !important">Hey there,</p>
                        <p align="left" class="intercom-align-left" style="line-height: 1.5; margin: 0 0 17px; text-align: left !important">You have requested the login link to your The Press Review subscription's settings.</p>
                        <p align="left" class="intercom-align-left" style="line-height: 1.5; margin: 0 0 17px; text-align: left !important">Click the button below login automatically.</p>
                        <div align="left" class="intercom-container intercom-align-left" style="margin-bottom: 16px; text-align: left !important"><a class="intercom-h2b-button" href="${locals.magic_link}" style="background-color: #3CB371; border: none; border-radius: 3px; color: #FFF; display: inline-block; font-size: 14px; font-weight: bold; outline: none !important; padding: 12px 35px; text-decoration: none" target="_blank">Login</a></div>
                        <p align="left" class="intercom-align-left" style="line-height: 1.5; margin: 0 0 17px; text-align: left !important">or copy and paste the given url in your web browser:</p>
                        <p align="left" class="intercom-align-left" style="line-height: 1.5; margin: 0 0 17px; text-align: left !important">${locals.magic_link}</p>
                        <p align="left" class="intercom-align-left" style="line-height: 1.5; margin: 0 0 17px; text-align: left !important"><br>Remember! This link is valid for next 30 minutes only.</p>
                        <p align="left" class="intercom-align-left" style="line-height: 1.5; margin: 0 0 17px; text-align: left !important"><i>- Chris</i></p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        ${renderFooter(locals)}
        <img alt="" border="0" height="1" src="https://www.google-analytics.com/collect?v=1&tid=UA-104622151-1&t=event&cid=${locals.subscriber.id}&t=event&ec=email&ea=login" style="visibility:hidden !important;display:block !important;height:1px !important;width:1px !important;border-width:0 !important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;padding-top:0 !important;padding-bottom:0 !important;padding-right:0 !important;padding-left:0 !important;-ms-interpolation-mode:bicubic;line-height:100%;outline-style:none;text-decoration:none;" width="1">
      </body>
    </html>
  `
}
