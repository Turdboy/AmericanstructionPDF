import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

// 🟩 Environment config: set via `firebase functions:config:set ...`
const gmailEmail = functions.config().gmail.email;
const gmailPass = functions.config().gmail.password;

// ✅ Set up Gmail transporter
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPass,
  },
});



const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 60,
  memory: "256MB",
};


// 📩 Main callable function: send emails to client + inspector
export const sendProposalEmail = functions
  .runWith(runtimeOpts)
  .https
  .onCall(async (data, context) => {
  const { clientEmail, inspectorEmail, link } = data as unknown as {

  clientEmail: string;
  inspectorEmail: string;
  link: string;
};


  const mailOptions = {
    from: `Americanstruction <${gmailEmail}>`,
    to: [clientEmail, inspectorEmail],
    subject: "Please Sign Your Roofing Proposal",
    html: `
      <p>Hello,</p>
      <p>Please click the link below to sign your roofing proposal:</p>
      <p><a href="${link}">${link}</a></p>
      <p>Thank you,<br/>The Americanstruction Team</p>
    `,
  };

  try {
    await mailTransport.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: (error as Error).message };

  }
});
