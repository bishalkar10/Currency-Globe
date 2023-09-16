import { changeColor } from '../redux/reducer/themeSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

function ColorBlock({ color, handleColorChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      style={{
        backgroundColor: isActive ? color.active : isHovered ? color.hover : color.main,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      className={`h-12 w-12 sm:h-6 sm:w-6 rounded-full`}
      onClick={() => handleColorChange(color)}
    ></div>
  );
}

export default function Themes() {
  const dispatch = useDispatch();

  const handleColorChange = (color) => {
    dispatch(changeColor(color));
  };

  const colors = [
    { hover: "#dc2626", main: "#b91c1c", active: "#991b1b" }, // red
    { hover: "#16a34a", main: "#15803d", active: "#166534" }, // green
    { hover: "#2563eb", main: "#1d4ed8", active: "#1e40af" }, // blue
    { hover: "#9333ea", main: "#7e22ce", active: "#6b21a8" }, // purple
    { hover: "#ea580c", main: "#c2410c", active: "#9a3412" }, // orange
    { hover: "#e11d48", main: "#be123c", active: "#9f1239" }, // rose
  ];

  return (
    <div className="grid grid-cols-3 gap-5 sm:gap-2 rounded-md bg-white p-5 sm:p-2 w-max mx-auto">
      {colors.map((color, index) => (
        <ColorBlock
          key={index}
          color={color}
          handleColorChange={handleColorChange}
        />
      ))}
    </div>
  );
}
