import { useNavigate } from "react-router-dom";

export default function BotonHome() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Ir al Home
    </button>
  );
}
