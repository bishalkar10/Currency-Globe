import { changeColor } from '../redux/reducer/themeSlice';
import { useDispatch } from 'react-redux';

export default function Themes() {
  const dispatch = useDispatch();

  const handleColorChange = (color) => {
    dispatch(changeColor(color))
  }
  const colorOptions = ["#C53030", "#2F855A", "#1E40AF", "#6B46C1", "#D97706", "#B83280",];

  return (
    <div className="grid grid-cols-3 gap-5 sm:gap-2 rounded-md bg-white p-5 sm:p-2 w-max mx-auto">
      {colorOptions.map((color, index) => (
        <div
          key={color}
          style={{ backgroundColor: color }}
          className="h-12 w-12 sm:h-6 sm:w-6 rounded-full"
          onClick={() => handleColorChange(color)}
        ></div>
      ))}
    </div>
  );

}
