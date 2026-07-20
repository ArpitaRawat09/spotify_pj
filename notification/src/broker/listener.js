import { subscribeToQueue } from "./rabbit.js";
import sendEmail from "../utils/email.js";

function startListener() {
  subscribeToQueue("user_registered", async (msg) => {
    const { email, role, fullName } = msg;

    const template = `
<h1>Welcome to Spotify Music </h1>
<p>Dear ${fullName.firstName} ${fullName.lastName},</p>
<p>Thank you for registering with Spotify Music . We are excited to have
you on board!</p>
<p>Your role is: ${role}</p>
<p>We hope you enjoy our services.....</p>
<br/>
<p>Best regards,</p>
<p>Spotify  Team</p>
`;

await sendEmail(email, "Welcome to Spotify Music", "Thank you for registering with Spotify Music!", template);
  });
}

export default startListener;
