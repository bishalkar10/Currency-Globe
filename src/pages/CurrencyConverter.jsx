import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { Autocomplete, Box, TextField, Typography, CircularProgress } from '@mui/material';
import { currencies } from '../currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux";

export default function CurrencyConverter() {
  const [selectedCurrencies, setSelectedCurrencies] = useState({
    fromCurrency: 'USD',
    toCurrency: 'INR'
  });
  const [error, setError] = useState(false); // used to handle the error state of the input box
  const [amount, setAmount] = useState(1); // used to store the amount entered in the input box which is later used to convert to the target currency
  const [exchangedValue, setExchangedValue] = useState('0'); // used to store the converted value which will shown on the screen
  const [loading, setLoading] = useState(false); // used to handle the loading state of the app
  const selectedColor = useSelector(state => state.theme.color);

  useEffect(() => {
    document.title = 'Currency Converter - Currency Globe';
  }, []);

  const handleOptionChange = (fieldName, newValue) => {
    setSelectedCurrencies((prevSelectedCurrencies) => ({
      ...prevSelectedCurrencies,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };

  const handleNumberChange = (e) => {
    const inputValue = e.target.value;
    if (/^[0-9]*$/.test(inputValue) && inputValue.length <= 9) { // the inputValue must be a digit
      setAmount(inputValue);
      setError(false)
    }
  };

  const fetchExchangeRates = async () => {

    if (amount == 0) {
      setError(true)
      return
    }
    if (selectedCurrencies.fromCurrency === selectedCurrencies.toCurrency) {
      console.log('same currency')
      return
    }
    if (selectedCurrencies.fromCurrency == null || selectedCurrencies.toCurrency == null) {
      console.log('null currency')
      return
    }

    setLoading(true);
    const apiKey = import.meta.env.VITE_API_KEY;
    const url = "https://api.currencybeacon.com/v1/";
    const endpoint = "convert";
    try {
      const response = await axios.get(url + endpoint, {
        params: {
          from: selectedCurrencies.fromCurrency,
          to: selectedCurrencies.toCurrency,
          amount: amount
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "content-type": "application/json"
        }
      })
      const data = response.data.response;
      // const timeStamp = data.timestamp;
      // const date = data.date;
      const value = data.value;
      setLoading(false);
      setExchangedValue(value.toFixed(2))  // * Example : 829.42 Rupee

    } catch (error) {
      console.error(error.message)
      setLoading(false);
    }
  }
  return (

    <div className="grid place-content-center min-h-[calc(100vh-80px)] w-full">
      <div style={{ borderColor: `${selectedColor}` }} className={`bg-white border-2  flex flex-col gap-11 p-4 md:p-8 rounded-2xl`}>
        <h2 style={{ color: `${selectedColor}` }} className={`text-3xl text-center font-bold  font-Inter`}>Currency Converter</h2>
        <div className='w-full flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-6'>
          <Autocomplete
            className='w-[250px] md:w-[300px]'
            disablePortal
            id="fromCurrency"
            options={currencies}
            value={currencies.find((option) => option.value === selectedCurrencies.fromCurrency) || null}
            onChange={(_, newValue) => handleOptionChange('fromCurrency', newValue)}
            getOptionLabel={(option) => `${option.name} (${option.value})`}
            renderInput={(params) => <TextField {...params} label="From Currency" />}
          />
          <FontAwesomeIcon style={{ color: `${selectedColor}` }} icon={faArrowRightArrowLeft} />
          <Autocomplete
            className='w-[250px] md:w-[300px]'
            disablePortal
            id="toCurrency"
            options={currencies}
            value={currencies.find((option) => option.value === selectedCurrencies.toCurrency) || null}
            onChange={(_, newValue) => handleOptionChange('toCurrency', newValue)}
            getOptionLabel={(option) => `${option.name} (${option.value})`}
            renderInput={(params) => <TextField {...params} label="To Currency" />}
          />
        </div>

        <div className='flex flex-col sm:flex-row w-full justify-center items-center gap-3 md:gap-6 '>
          <div className='relative'>
            <input
              className={`border-[1px] ${error && "animate-shake"} border-[#c4c4c4] p-4 w-[226px] h-[56px]`}
              id="currency-amount"
              name="currency-amount"
              placeholder="Enter Amount"
              value={amount}
              onChange={handleNumberChange}
            />
            {error && <p className='absolute top-full mt-1 text-sm left-4 text-[red]'>Enter a valid positive number</p>}
          </div>
          {loading
            ?
            <button
              disabled
              style={{ backgroundColor: `${selectedColor}` }}
              className={`text-white w-[108.05px] h-10 px-3 py-1 flex justify-center items-center gap-2 text- rounded-md`}
            > <CircularProgress size="20px" sx={{ color: "#fff" }} />
            </button>
            :
            <button
              onClick={fetchExchangeRates}
              style={{ backgroundColor: `${selectedColor}` }}
              className=" text-white px-3 py-1 flex justify-center items-center gap-2 text- rounded-md"
            > Convert
              <span><i className='text-2xl'>&rarr;</i></span>
            </button>}
          <div className='border-[1px] border-[#c4c4c4] p-4 w-[226px] h-[56px]'>{exchangedValue}</div>
        </div>
      </div>
      {/* Rest of your component */}
    </div>
  );
}
