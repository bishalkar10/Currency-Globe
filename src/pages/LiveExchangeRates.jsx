import { useState, useEffect } from 'react'
import { currencies } from '../currency';
import { TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function LiveExchangeRates() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [exchangedCurrenciesList, setExchangedCurrenciesList] = useState({});
  const selectedColor = useSelector(state => state.theme.color);

  const handleChange = (_, newValue) => {
    if (newValue) {
      setBaseCurrency(newValue.value);
    }
  }
  useEffect(() => {
    document.title = 'Live Exchange Rate - Currency Globe';
  }, []);
  useEffect(() => {
    async function getLiveExchangeRates() {
      const apiKey = import.meta.env.VITE_API_KEY;
      const axiosOptions = {
        params: {
          base: baseCurrency,
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        }
      };
      try {
        const response = await axios.get("https://api.currencybeacon.com/v1/latest", axiosOptions);
        const data = response.data.rates;
        setExchangedCurrenciesList(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    getLiveExchangeRates();
  }, [baseCurrency]); // Re-trigger effect when axiosOptions changes

  const cardList = Object.keys(exchangedCurrenciesList).map((currency, index) => {
    const currencyCode = currency;
    const exchangeValue = exchangedCurrenciesList[currency].toFixed(3);

    return <Card key={index} currencyCode={currencyCode} exchangeValue={exchangeValue} />
  })

  return (
    <div className="min-h-[calc(100vh-80px)] w-full px-3 sm:px-8 py-3">
      <div style={{ borderColor: `${selectedColor}` }} className={`bg-white p-5 border-2 rounded-lg mb-5`}>
        <h2 style={{ color: `${selectedColor}` }} className='text-xl sm:text-3xl text-center font-bold font-Inter'> Live Exchange Rates</h2>
        <Autocomplete
          className='mx-auto mt-5'
          disablePortal
          id="base-currency"
          options={currencies}
          value={currencies.find((option) => option.value === baseCurrency) || null}
          onChange={handleChange}
          getOptionLabel={(option) => `${option.name} (${option.value})`}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Base Currency" />}
        />
      </div>
      <div className='grid gap-3 auto-rows-min grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-[400px] sm:max-w-[700px] md:max-w-[920px]  mx-auto '>
        {cardList}
      </div>
    </div>
  )
}

const Card = ({ currencyCode, exchangeValue }) => {
  const selectedColor = useSelector(state => state.theme.color);

  return (
    <div style={{ backgroundColor: `${selectedColor}` }} className={`py-3 px-5 custom-shadow2 rounded w-full flex justify-between items-center`}>
      <h4 className='text-3xl font-Inter font-semibold text-white text-left'>{currencyCode}</h4>
      <p className='text-center text-white font-Inter '>{exchangeValue}
      </p>
    </div>

  )
}
