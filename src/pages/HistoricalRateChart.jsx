import { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "../components/BarChart";
import { currencies } from "../currency";
import { Autocomplete, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

export default function HistoricalRateChart() {
  const [baseCurrency, setBaseCurrency] = useState("INR");
  const [today, seventhDay] = getTodayAnd7thDay();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedColor = useSelector((state) => state.theme.color);
  const [isHovered, setIsHovered] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [showNotice, setShowNotice] = useState(true);

  function handleChange(_, newValue) {
    if (newValue) {
      setBaseCurrency(newValue.value);
    }
  }

  //function to format date in YYYY-MM-DD fromat which will be used as API parameters.
  function getDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // function to format date in in this format: Sep 12
  // We will be using this dates in the chart's x axis.
  function formatDate(inputDate) {
    const [year, month, day] = inputDate.split("-");
    const monthIndex = parseInt(month, 10) - 1; // Month indexes are 0-based
    const date = new Date(year, monthIndex, day);
    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });

    return formattedDate;
  }

  // function to get today's date and the 7th day if to day is 2023-01-07 then 7th day would be 2023-01-01
  function getTodayAnd7thDay() {
    const today = new Date();
    const seventhDay = new Date(today);
    seventhDay.setDate(today.getDate() - 6);

    return [getDate(today), getDate(seventhDay)];
  }

  function getChartData(apiData, currency) {
    // sort dates in ascending order
    const dates = Object.keys(apiData).sort(); // ["2019-01-01","2019-01-02","2019-01-03","2019-01-04","2019-01-05","2019-01-06","2019-01-07"]
    const chartData = [];

    for (const date of dates) {
      //"2019-01-01"
      const value = apiData[date]; // 48
      chartData.push({
        date: formatDate(date),
        value: parseFloat(value[currency].toFixed(2)),
      }); // { date: "May 5", value: 48}
    }
    return chartData;
  }

  // set the page title
  useEffect(() => {
    document.title = "Historical Rate Chart - Currency Globe";
  }, []);

  useEffect(() => {
    async function getLiveExchangeRates() {
      setLoading(true);
      const apiKey = import.meta.env.VITE_PRINCIPAL_API_KEY;
      const axiosOptions = {
        method: "GET",
        url: "https://currency-conversion-and-exchange-rates.p.rapidapi.com/timeseries",
        params: {
          start_date: seventhDay,
          end_date: today,
        },
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host":
            "currency-conversion-and-exchange-rates.p.rapidapi.com",
        },
      };
      try {
        const response = await axios.request(axiosOptions);
        const data = response.data.rates;
        const chartData = getChartData(data, baseCurrency);
        setChartData(chartData);
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    }
    getLiveExchangeRates();
  }, [today, seventhDay, baseCurrency]);

  return (
    <div className="min-h-[calc(100vh-80px)] w-full px-3 sm:px-8 py-3">
      <div
        style={{ borderColor: selectedColor.main }}
        className="bg-white p-5 border-2 rounded-lg mb-5 relative"
      >
        <h2
          style={{ color: selectedColor.main }}
          className="text-xl sm:text-3xl text-center font-bold font-Inter"
        >
          Historical Rate Chart
        </h2>
        <Autocomplete
          className="mx-auto mt-5"
          disablePortal
          id="base-currency"
          options={currencies}
          value={
            currencies.find((option) => option.value === baseCurrency) || null
          }
          onChange={handleChange}
          getOptionLabel={(option) => `${option.name} (${option.value})`}
          sx={{ width: 200 }}
          renderInput={(params) => (
            <TextField {...params} label=" Selected Currency" />
          )}
        />
        {showNotice && (
          <div
            style={{ backgroundColor: selectedColor.main }}
            className="rounded absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 flex gap-3 items-center p-1 max-w-full text-white text-center w-max mx-auto"
          >
            <p className="text-xs">
              Note : The base currency is fixed as <b>"EUR"</b>. The API doesn't
              support any other base currency.
            </p>
            <FontAwesomeIcon
              icon={faX}
              className="p-1 text-sm"
              // when we click the button then show the active color and on hover it will show hover color
              style={{
                backgroundColor: isActive
                  ? selectedColor.active
                  : isHovered
                  ? selectedColor.hover
                  : "",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseDown={() => setIsActive(true)}
              onMouseUp={() => setIsActive(false)}
              onClick={() => setShowNotice(false)}
            />
          </div>
        )}
      </div>
      {!loading && <BarChart data={chartData} />}
    </div>
  );
}
