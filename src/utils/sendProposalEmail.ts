// src/utils/sendProposalEmail.ts
import emailjs from "emailjs-com";

export const sendProposalEmail = async ({
  to_email,
  to_name,
  proposal_link
}: {
  to_email: string;
  to_name: string;
  proposal_link: string;
}) => {
  try {
    await emailjs.send(
      "service_j731cav",        // ✅ Your Service ID
      "template_0sely1i",       // ✅ Your Template ID
      {
        to_email,
        to_name,
        proposal_link
      },
      "avGAhe_OGifJgs4hA"    // 🔁 Replace with your actual EmailJS public key
    );
    console.log("✅ Email sent to client!");
  } catch (error) {
    console.error("❌ Email failed to send", error);
  }
};
