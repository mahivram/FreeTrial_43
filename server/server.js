const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

app.post("/send-sos", async (req, res) => {
  const { phoneNumber, latitude, longitude } = req.body;

  const message = `🚨 SOS Alert! I need help. My location:  
  🌍 Latitude: ${latitude}, Longitude: ${longitude}  
  📍 Google Maps: https://maps.google.com/?q=${latitude},${longitude}`;

  try {
    // Send SOS SMS via Twilio
    console.log("Sending SOS alert to:", phoneNumber);
    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phoneNumber,
    });

    res.status(200).send({ message: "✅ SOS Alert sent successfully!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).send({ error: "Failed to send SOS alert." });
  }
});

app.post("/send-location", async (req, res) => {
  const { phoneNumber, latitude, longitude } = req.body;

  const message = ` My location:  
  🌍 Latitude: ${latitude}, Longitude: ${longitude}  
  📍 Google Maps: https://maps.google.com/?q=${latitude},${longitude}`;

  try {
    // Send SOS SMS via Twilio
    console.log("Sending SOS alert to:", phoneNumber);
    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phoneNumber,
    });

    res.status(200).send({ message: "✅ SOS Alert sent successfully!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).send({ error: "Failed to send SOS alert." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
