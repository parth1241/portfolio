// server.js
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Serve views (static HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/api/contact', (req, res) => {
  console.log('Contact payload:', req.body);
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Portfolio server listening on http://localhost:${PORT}`);
});
