import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [date, setDate] = useState('');
  const [tradeStats, setTradeStats] = useState(null);

  const handleChangeSymbol = (e) => {
    setSymbol(e.target.value);
  };

  const handleChangeDate = (e) => {
    setDate(e.target.value);
  };

  const handleGetTradeStatistics = async () => {
    if (!symbol || !date) {
      alert('Please enter both stock symbol and date.');
      return;
    }
    const trimmedSymbol = symbol.trim();
    try {
      const apiUrl = `http://localhost:8080/api/fetchStockData/${trimmedSymbol}/${date}`;
      const response = await axios.get(apiUrl);
      setTradeStats(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again later.');
      setTradeStats(null);
    }
  };

  return (
    <div className="App">
      <h1>Stock Trade Statistics</h1>
      <div>
        <label htmlFor="symbol">Stock Symbol:</label>
        <input
          type="text"
          id="symbol"
          placeholder="Please Enter stock symbol"
          value={symbol}
          onChange={handleChangeSymbol}
        />
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleChangeDate}
        />
        <button onClick={handleGetTradeStatistics}>Get Trade Statistics</button>
      </div>
      {tradeStats && (
        <div id="statistics">
          <h2>Trade Statistics for {tradeStats.symbol} on {tradeStats.day}</h2>
          <ul>
            <li>Open: ${tradeStats.open}</li>
            <li>High: ${tradeStats.high}</li>
            <li>Low: ${tradeStats.low}</li>
            <li>Close: ${tradeStats.close}</li>
            <li>Volume: {tradeStats.volume}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
