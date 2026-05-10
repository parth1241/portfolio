const express = require('express');
const router = express.Router();

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

router.post('/contact', (req, res) => {
  console.log('Contact Form Submission:', req.body);
  // Simulate processing delay
  setTimeout(() => {
    res.json({ success: true, message: 'Message sent ✓' });
  }, 1000);
});

module.exports = router;
