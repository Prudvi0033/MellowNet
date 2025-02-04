import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv"

dotenv.config()

const TOKEN = process.env.MAIL_TRAP_TOKEN

export const client = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "0033.itachi@gmail.com",
  name: "Mellow Net",
};
// const recipients = [
//   {
//     email: "0033.itachi@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);