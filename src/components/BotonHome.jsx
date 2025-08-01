import { useNavigate } from "react-router-dom";

export default function BotonHome() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-gradient-to-br from-neutral-600 to-neutral-700 hover:bg-gradient-to-br hover:from-neutral-700 hover:to-neutral-900 text-white rounded "
    >
      Ir al Home
    </button>
  );
}
