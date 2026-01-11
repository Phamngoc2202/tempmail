const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});


app.use(express.static('public'));

// domains
app.get('/api/domains', async (req, res) => {
  const r = await fetch('https://mail.epmmo.com/api/domains');
  res.json(await r.json());
});

// random email
app.get('/api/random', async (req, res) => {
  const domain = req.query.domain;
  const url = domain
    ? `https://mail.epmmo.com/api/random-email?domain=${domain}`
    : `https://mail.epmmo.com/api/random-email`;

  const r = await fetch(url);
  res.json(await r.json());
});

// inbox
app.get('/api/inbox/:email', async (req, res) => {
  const r = await fetch(
    `https://mail.epmmo.com/api/email/${encodeURIComponent(req.params.email)}`
  );
  res.json(await r.json());
});

// mail detail
app.get('/api/mail/:id', async (req, res) => {
  const r = await fetch(
    `https://mail.epmmo.com/api/inbox/${encodeURIComponent(req.params.id)}`
  );
  res.json(await r.json());
});

app.listen(PORT, () =>
  console.log(`🚀 TempMail chạy tại http://localhost:${PORT}`)
);
