import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LiveExchangeRates from './pages/LiveExchangeRates';
import CurrencyConverter from './pages/CurrencyConverter';
import HistoricalRateChart from './pages/HistoricalRateChart';

function App() {

  return (
    <>
      <Router >
        <Navbar />
        <Routes>
          <Route path="/" element={<CurrencyConverter />} />
          <Route path="/live-exchange-rates" element={<LiveExchangeRates />} />
          <Route path="/currency-converter" element={<CurrencyConverter />} />
          <Route path="/historical-rate-chart" element={<HistoricalRateChart />} />
        </Routes>
      </Router>
    </>
  )
}

export default App


