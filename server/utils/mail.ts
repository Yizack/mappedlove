import type { NitroRuntimeConfig } from "nitropack";

interface EmailMessage {
  to: {
    name: string;
    email: string;
  };
  subject: string;
  html: string;
}

const mailChannels = async (config: NitroRuntimeConfig, message: EmailMessage) : Promise<Boolean> => {
  const { to, subject, html } = message;
  return await $fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: to.email, name: to.name }]
      }],
      from: {
        email: config.mail.from,
        name: `${config.mail.fromName}`
      },
      subject,
      content: [{
        type: "text/html",
        value: html
      }]
    })
  }).then(() => true).catch((e) => {
    console.warn(e);
    return false;
  });
};

const nodeMailer = async (config: NitroRuntimeConfig, message: EmailMessage) => {
  // @ts-ignore
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    port: config.mail.port,
    host: config.mail.host,
    auth: {
      user: config.mail.login,
      pass: config.mail.password
    }
  });

  const verified = await new Promise((resolve, reject) => {
    transporter.verify((error: any, success: any) => {
      if (error) return reject(error);
      return resolve(success);
    });
  });

  return new Promise((resolve, reject) => {
    if (!verified) reject(new Error("SMTP server not verified."));
    const { to, subject, html } = message;
    const mail = {
      to: `"${to.name}" <${to.email}>`,
      subject,
      html,
      from: `"${config.mail.fromName}" <${config.mail.from}>`
    };

    transporter.sendMail(mail, (err: any) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};

export const sendMail = async (config: NitroRuntimeConfig, message: EmailMessage) => {
  if (process.dev) return nodeMailer(config, message);
  return mailChannels(config, message);
};
