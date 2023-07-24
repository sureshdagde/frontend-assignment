// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');

app.get('/api/fetchStockData/:symbol/:date', async(req, res) => {
    // YOUR CODE GOES HERE, PLEASE DO NOT EDIT ANYTHING OUTSIDE THIS FUNCTION
    const { symbol, date } = req.params;

  if (!symbol || !date) {
    return res.status(400).json({ error: 'Both stock symbol and date are required.' });
  }

  try {
    const apiUrl = `https://api.polygon.io/v1/open-close/${symbol}/${date}?apiKey=${process.env.API_KEY}`;
    const response = await axios.get(apiUrl);

    const tradeStats = {
      symbol: response.data.symbol,
      day: response.data.day,
      open: response.data.open,
      high: response.data.high,
      low: response.data.low,
      close: response.data.close,
      volume: response.data.volume,
    };

    return res.json(tradeStats);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Trade statistics not found for the specified symbol and date.' });
    }

    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
    // res.sendStatus(200); 
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));