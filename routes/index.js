const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.get('/', (req, res) => {
  res.render('index', { title: 'Home | Portfolio', active: 'home' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Me | Portfolio', active: 'about' });
});

router.get('/skills', (req, res) => {
  res.render('skills', { title: 'My Skills | Portfolio', active: 'skills' });
});

router.get('/projects', (req, res) => {
  res.render('projects', { title: 'My Projects | Portfolio', active: 'projects' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Me | Portfolio', active: 'contact' });
});

router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Contact Form Submission:', req.body);

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['erparthkaran@gmail.com'],
      subject: `[Portfolio] ${subject} — from ${name}`,
      html: `
        <h2>New Portfolio Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p style="color: #888; font-size: 12px;">Sent from your Cyberpunk Portfolio contact form.</p>
      `,
    });

    res.json({ success: true, message: 'Message sent ✓' });
  } catch (error) {
    console.error('Resend Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

module.exports = router;
