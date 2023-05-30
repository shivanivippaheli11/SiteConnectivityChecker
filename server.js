const express = require('express');
const bodyParser=require('body-parser');
const checkConnectivity = require('./checkConnectivity');

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.post('/check', (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) {
      res.status(400).json({ error: 'Invalid URLs' });
      return;
    }
    checkConnectivity(urls)
      .then(results => {
        res.json({ results });
      })
      .catch(error => {
        console.error('An error occurred while checking connectivity:', error);
        res.status(400).json({ error: 'Internal Server Error' });
      });
  });
  

  app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
