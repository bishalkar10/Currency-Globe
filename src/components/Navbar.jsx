import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Themes from "./Theme";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const selectedColor = useSelector(state => state.theme.color);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setIsOpen(false);
      }
    };

    handleResize(); // Set initial state

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs once

  return (
    <header className="h-20 w-full">
      <nav style={{ backgroundColor: `${selectedColor}`, borderBottomColor: `${selectedColor}` }} className="w-full h-full border-b-2 text-white flex justify-between items-center gap-10 px-4">
        <h1 className="font-Inter mr-auto text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap">Currency Globe</h1>
        <ul className="font-Roboto hidden sm:flex gap-5 ">
          <li className="hover:font-semibold sm:whitespace-pre-line"><Link to="/live-exchange-rates"> Live Exchange Rates </Link></li>
          <li className="hover:font-semibold sm:whitespace-pre-line"><Link to="/currency-converter"> Currency Converter </Link></li>
          <li className="hover:font-semibold sm:whitespace-pre-line"><Link to="/historical-rate-chart"> Historical Rate Chart </Link></li>
        </ul>
        <div className="hidden sm:block">
          <Themes />
        </div>
        <button
          className="hover:bg-[rgba(0,0,0,0.1)] grid place-content-center h-12 w-12 rounded-full sm:hidden text-2xl text-white outline-none"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <FontAwesomeIcon className="text-3xl" icon={faTimes} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </button>

        <div className={`absolute top-20 right-0 ${isOpen ? "translate-x-0" : "translate-x-full"} transform p-5 duration-300 border-t-2 border-white min-h-screen w-80 bg-${selectedColor}-700 z-20`}>
          <ul className='flex flex-col mb-10'
          >
            <li className="hover:bg-[rgba(0,0,0,0.1)] text-xl block py-3">
              <Link to="/live-exchange-rates">Live Exchange Rates</Link>
            </li>
            <li className="hover:bg-[rgba(0,0,0,0.1)] text-xl block py-3">
              <Link to="/currency-converter">Currency Converter</Link>
            </li>
            <li className="hover:bg-[rgba(0,0,0,0.1)] text-xl block py-3">
              <Link to="/historical-rate-chart">Historical Rate Chart</Link>
            </li>
          </ul>
          <div>
            <Themes />
          </div>
        </div>
      </nav>
    </header>
  )
}