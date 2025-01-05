const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password', // Replace with your email password or app password
  },
});

app.post('/api/send-email', async (req, res) => {
  const { email, tierType, tierCount, layers, toppings } = req.body;

  const emailTemplate = `
    <h1>Your Cake Design</h1>
    <p>Tier Type: ${tierType}</p>
    ${tierType === 'multi' ? `<p>Number of Tiers: ${tierCount}</p>` : ''}
    <p>Layers:</p>
    <ul>
      ${layers.map((color, i) => `<li>Layer ${i + 1}: <span style="color: ${color};">${color}</span></li>`).join('')}
    </ul>
    <p>Toppings: ${toppings.join(', ') || 'None'}</p>
  `;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email, // Send to the user's email
    cc: 'indunissanka@gmail.com', // Send a copy to your email
    subject: 'Your Cake Design from The Cake Lounge',
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
